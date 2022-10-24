export interface Board {
    id: string,
    title: string,
    date: string,
    canvasData: string,
    canvasDimensions: { width: number, height: number }
    notesData: Array<any>,
    previewImage: string
};

