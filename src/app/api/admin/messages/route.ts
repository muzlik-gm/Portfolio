import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, Message } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get messages
    const messages = await Message.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Message.countDocuments(query);

    return NextResponse.json({
      messages: messages.map((msg: any) => ({
        id: msg._id.toString(),
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        respondedAt: msg.respondedAt,
        notes: msg.notes,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = { updatedAt: new Date() };

    if (status) {
      updateData.status = status;
      if (status === 'responded') {
        updateData.respondedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const message = await Message.findByIdAndUpdate(id, updateData, { new: true });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Message updated successfully',
      data: {
        id: message._id.toString(),
        status: message.status,
        respondedAt: message.respondedAt,
        notes: message.notes,
        updatedAt: message.updatedAt,
      }
    });

  } catch (error) {
    console.error('Message update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      );
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Message delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}