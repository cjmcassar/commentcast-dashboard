interface browserConsoleData {
  exceptionDetails?: {
    columnNumber: number;
    exception: {
      className: string;
      description: string;
    };
    exceptionId?: number;
    objectId: string;
    subtype: string;
    type: string;
    executionContextId: number;
    lineNumber?: number;
    scriptId?: string;
    text?: string;
    url?: string;
  };
  // ARGS BELOW
  args?: {
    type: string;
    value?: string;
    objectId: string;
    description?: string;
  }[];
  executionContextId: number;
  stackTrace?: {
    callFrames: {
      columnNumber: number;
      functionName: string;
      lineNumber: number;
      scriptId: string;
      url: string;
    }[];
  };
  timestamp?: number;
  type?: string;
}

export interface IssueInterface {
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
  browser_console_data: browserConsoleData[];
  browser_network_data: string;
}

export class Issue implements IssueInterface {
  browser_name: string | null = null;
  created_at: string = '';
  id: number = 0;
  logs: Array<{
    level: string;
    text: string;
    url?: string;
  }> = [];
  platform_arch: string = '';
  platform_os: string = '';
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null = null;
  screenshot: string = '/LargeLogo.png';
  url: string | null = null;
  is_public: boolean = false;
  browser_console_data: browserConsoleData[] = [];
  browser_network_data: string = '';
  constructor(data?: Partial<Issue>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
