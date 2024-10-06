export const downloadAsBlob = (data:string,fileName:string, type: string, ) =>{

    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
}
