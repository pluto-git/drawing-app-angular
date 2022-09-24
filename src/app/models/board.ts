export interface Board {
    id: string,
    title: any,
    date: string,
    canvasData: string,
    canvasDimensions: { width: number, height: number }
    notesData: Array<any>,
};