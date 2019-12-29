export interface Tool{
    Id: number;
    ToolName: string;
    ToolTip: string;
    ToolImage : string;
    ToolActionInvoker : string;
    ToolTypeID : string;
    ToolParams : string;
    ToolLocation : string;
    Order :  number;
    IsAGroup : boolean;
    ToolGroupId : number;
}