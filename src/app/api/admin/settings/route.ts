import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Settings } from "@/lib/models";
import { verifyToken, getTokenFromRequest, hasPermission } from "@/lib/auth";
import { getCachedData, invalidateCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || !hasPermission(user, 'manage_settings')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category) {
      query = { category: category.toLowerCase() };
    }

    // Cache key for settings
    const cacheKey = `settings:${category || 'all'}`;

    const settings = await getCachedData(
      cacheKey,
      () => Settings.find(query)
        .populate('updatedBy', 'firstName lastName email')
        .sort({ category: 1, key: 1 }),
      { ttl: 600 } // 10 minutes TTL for settings
    );

    // Group settings by category for easier frontend consumption
    const groupedSettings = settings.reduce((acc, setting) => {
      const cat = setting.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push({
        id: setting._id,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        description: setting.description,
        isPublic: setting.isPublic,
        updatedBy: setting.updatedBy,
        updatedAt: setting.updatedAt,
        createdAt: setting.createdAt,
      });
      return acc;
    }, {});

    return NextResponse.json({
      message: "Settings retrieved successfully",
      settings: groupedSettings
    });

  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || !hasPermission(user, 'manage_settings')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { settings } = await request.json();

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { message: "Settings array is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedSettings = [];
    const errors = [];

    for (const setting of settings) {
      const { key, value, type, category, description, isPublic } = setting;

      if (!key || value === undefined || !type || !category) {
        errors.push({ key, message: "Key, value, type, and category are required" });
        continue;
      }

      try {
        const updatedSetting = await Settings.findOneAndUpdate(
          { key: key.toLowerCase() },
          {
            value,
            type,
            category: category.toLowerCase(),
            description,
            isPublic: isPublic || false,
            updatedBy: user.id,
            updatedAt: new Date(),
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        ).populate('updatedBy', 'firstName lastName email');

        updatedSettings.push({
          id: updatedSetting._id,
          key: updatedSetting.key,
          value: updatedSetting.value,
          type: updatedSetting.type,
          category: updatedSetting.category,
          description: updatedSetting.description,
          isPublic: updatedSetting.isPublic,
          updatedBy: updatedSetting.updatedBy,
          updatedAt: updatedSetting.updatedAt,
          createdAt: updatedSetting.createdAt,
        });
      } catch (error) {
        console.error(`Update setting ${key} error:`, error);
        errors.push({ key, message: "Failed to update setting" });
      }
    }

    // Invalidate settings cache after updates
    await invalidateCache('settings:*');

    return NextResponse.json({
      message: "Settings updated successfully",
      updatedSettings,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}