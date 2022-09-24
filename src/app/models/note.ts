
export interface Note {
    type: string,
    id: string,
    message: string,
    color: string,
    positionX: number,
    positionY: number,
    editId: string,
    isHidden: boolean,
    isDisabled: boolean,
    dragDisabled: boolean,
    dragZone : string
}