export interface Board {
    id: number,
    title: any,
    date: string,
    canvasData: string,
    canvasDimensions: { width: number, height: number }
    notesData: Array<any>,
    previewImage: string
};