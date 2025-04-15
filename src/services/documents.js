import axiosInterceptor from '@/utils/axiosInterceptor';

export const documents = {
    list() {
        return axiosInterceptor.get('/documents/');
    },
    upload(document) {
        const formData = new FormData();
        formData.append('file', document.file);
        formData.append('title', document.title);
        formData.append('size', document.size);

        return axiosInterceptor.post('/documents/', document ,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                } 
            }
        );
    }
}