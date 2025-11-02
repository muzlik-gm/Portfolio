import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Icon({ name, className = "", size = 'md' }: IconProps) {
  const sizeMap = {
    sm: 16,
    md: 24, 
    lg: 32
  };

  const iconMap: Record<string, keyof typeof LucideIcons> = {
    // Admin icons
    'blog': 'FileText',
    'projects': 'Briefcase', 
    'analytics': 'BarChart3',
    'settings': 'Settings',
    'users': 'Users',
    'dashboard': 'Home',
    'edit': 'Pencil',
    'delete': 'Trash2',
    'view': 'Eye',
    'add': 'Plus',
    'save': 'Save',
    'upload': 'Upload',
    'download': 'Download',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'ArrowUpDown',
    'refresh': 'RefreshCw',
    'lock': 'Lock',
    'unlock': 'Unlock',
    'check': 'Check',
    'cross': 'X',
    'warning': 'AlertTriangle',
    'info': 'Info',
    'success': 'CheckCircle',
    'error': 'XCircle',
    // Navigation icons
    'home': 'Home',
    'about': 'User',
    'contact': 'Mail',
    'menu': 'Menu',
    'close': 'X',
    'arrow-left': 'ArrowLeft',
    'arrow-right': 'ArrowRight',
    'arrow-up': 'ArrowUp',
    'arrow-down': 'ArrowDown',
    // Social icons  
    'github': 'Github',
    'linkedin': 'Linkedin',
    'twitter': 'Twitter',
    'email': 'Mail',
    'discord': 'MessageCircle',
    // Tech icons
    'react': 'Atom',
    'javascript': 'FileCode',
    'typescript': 'FileCode',
    'nodejs': 'Server',
    'database': 'Database',
    'api': 'Plug',
    'web': 'Globe',
    'mobile': 'Smartphone',
    'desktop': 'Monitor',
    // Status icons
    'live': 'Circle',
    'development': 'Circle', 
    'archived': 'Circle',
    'draft': 'FileText',
    'published': 'CheckCircle',
    'featured': 'Star',
    // Action icons
    'external-link': 'ExternalLink',
    'copy': 'Copy',
    'share': 'Share2',
    'bookmark': 'Bookmark',
    'heart': 'Heart',
    'star': 'Star',
    'flag': 'Flag',
    'tag': 'Tag'
  };

  const iconName = iconMap[name] || 'HelpCircle';
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <IconComponent size={sizeMap[size]} className={className} />
  );
}