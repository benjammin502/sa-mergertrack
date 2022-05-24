import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISaMergerTrackProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userInfo: any;
  context: WebPartContext
  pageContext: any;
}
