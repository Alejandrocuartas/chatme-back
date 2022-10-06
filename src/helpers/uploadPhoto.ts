const cloudinary = require("cloudinary").v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadPhoto = async (path: string): Promise<string> => {
    try {
        const { secure_url } = await cloudinary.uploader.upload(path, {
            folder: "chatme",
        });
        return secure_url;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default uploadPhoto;
