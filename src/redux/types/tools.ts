interface ToolMetadata {
    Id: number
    ToolName: string
    ToolTip: string
    ToolImage: string
    ToolIcon: string
    ToolActionInvoker: string
    ToolInvokerType: number
    ToolTypeID: number
    OnCreate: string
    OnDestroy: string
    ToolParams: string
    ToolLocation: string
    Order: number
    IsAGroup: number
    ToolGroupId: number
    ToolContainer: string
    IsOpen: number
}

interface GroupMetadata {
    Id: number
    GroupContainer: string
    GroupName: string
    GroupImage: string
    IsOpen: number
}

interface MapsToolState {
    tools: { [toolId: string]: ToolMetadata }
    Groups: { [groupId: string]: GroupMetadata }
}

export interface ToolState {
    [name: string]: MapsToolState,
    blueprint: MapsToolState
}
