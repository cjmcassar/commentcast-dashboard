export interface Issue {
  browser_name: string | null;
  created_at: string;
  id: number;
  logs: Array<{
    level: string;
    text: string;
    url?: string;
  }>;
  platform_arch: string;
  platform_os: string;
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null;
  screenshot: string;
  url: string | null;
  is_public: boolean;
  browser_console_data: string;
  browser_network_data: string;
}
