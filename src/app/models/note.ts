export interface Note {
    type: string,
    id: string,
    message: string,
    color: string,
    positionX: number,
    positionY: number,
    isHidden: boolean,
    dragDisabled: boolean,
    editId?: string,
    dragZone: string,
    isDisabled?: boolean,
    initialCanvasX?: number,
    initialCanvasY?: number,
    initialPercX?: number,
    initialPercY?: number,
    lastRelativeCoordinates?: Array<{ x: number, y: number }>
}