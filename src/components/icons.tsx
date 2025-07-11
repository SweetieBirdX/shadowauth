import {
  Shield,
  Eye,
  EyeOff,
  Zap,
  Code,
  Users,
  BarChart3,
  Settings,
  Plus,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Menu,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Trash2,
  Edit3,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Sun,
  Moon,
  Github,
  Twitter,
  MessageCircle,
  Send,
  Instagram,
  Globe,
  Server,
  type LucideIcon,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  shield: Shield,
  eye: Eye,
  eyeOff: EyeOff,
  zap: Zap,
  code: Code,
  users: Users,
  barChart: BarChart3,
  settings: Settings,
  plus: Plus,
  key: Key,
  lock: Lock,
  unlock: Unlock,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alertCircle: AlertCircle,
  info: Info,
  menu: Menu,
  x: ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  copy: Copy,
  download: Download,
  upload: Upload,
  trash: Trash2,
  edit: Edit3,
  search: Search,
  filter: Filter,
  refresh: RefreshCw,
  sun: Sun,
  moon: Moon,
  twitter: Twitter,
  discord: MessageCircle,
  telegram: Send,
  instagram: Instagram,
  website: Globe,
  server: Server,
  loader2: Loader2,
  github: Github
} 