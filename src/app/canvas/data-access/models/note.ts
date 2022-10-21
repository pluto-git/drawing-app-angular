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
    // for our initial canvas size
    initialCanvasSize: { width: number, height: number },

    
    // in pixels for dragging back
    lastOffsetCoordinates?: Array<{ x: number, y: number }>,
    //in pixels to get set positionX/positionY
    lastPositions?: Array<{ x: number, y: number }>,
    //canva sizes on each position change/drag
    lastCanvasSize?: Array<{ width: number, height: number }>
}

// positionX and positionY are percents!!!!