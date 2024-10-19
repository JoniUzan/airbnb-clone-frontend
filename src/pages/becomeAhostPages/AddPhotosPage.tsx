import React, { useEffect, useState } from "react";
import camera from "../../assets/camera.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { Home } from "@/layouts/BecomeAhostLayout";
import api from "@/services/api.service";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/Loader";

function AddPhotosPage() {
  const [, setNewHome] =
    useOutletContext<[Home, React.Dispatch<React.SetStateAction<Home>>]>();

  const { toast } = useToast();

  // Separate state for image URLs from localStorage
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};
    return homeObject?.imgUrls || [];
  });

  // State for newly selected File objects
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const [isDisabled, setIsDisabled] = useState(true);
 

  useEffect(() => {
    if (selectedImages.length + imageUrls.length >= 5) {
      setSearchParams({ step: "addPhotos" });
      setIsDisabled(false);
    } else {
      setSearchParams(() => ({ step: "" }));
    }
    // Handle new home update after images are uploaded
    handleNewHomeUpdate();
  }, [selectedImages, imageUrls]);

  async function handleNewHomeUpdate() {
    // Fetch existing home object from local storage
    const localStorageHome = localStorage.getItem("newHome");
    const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

    // Update the newHome state with image URLs (both from localStorage and new ones)
    const updatedHome = {
      ...homeObject,
      imgUrls: [...imageUrls], // Use existing URLs from localStorage and newly uploaded ones
    };

    setNewHome(updatedHome);
    localStorage.setItem("newHome", JSON.stringify(updatedHome));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
    }
    e.target.value = ""; // Clear the file input
  };

  const handleDeleteImage = (index: number, fromLocalStorage: boolean) => {
    if (fromLocalStorage) {
      setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    } else {
      setSelectedImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    }
  };

  const handleCancel = () => {
    setSelectedImages([]);
    setIsDialogOpen(false);
  };

  const handleUpload = async () => {
    if (selectedImages.length + imageUrls.length < 5) {
      toast({
        title: "Error",
        description:
          "Photo upload failed. Please ensure you have added at least 5 photos before submitting.",
      });
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setIsDisabled(true);
      toast({
        description: <Loader />,
      });
      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const uploadedUrls = response.data.imageUrls;
        const localStorageHome = localStorage.getItem("newHome");
        const homeObject = localStorageHome ? JSON.parse(localStorageHome) : {};

        const updatedHome = {
          ...homeObject,
          imgUrls: [...imageUrls, ...uploadedUrls], // Combine existing and new URLs
        };

        setNewHome(updatedHome);
        localStorage.setItem("newHome", JSON.stringify(updatedHome));
        toast({
          title: "Upload Photos ",
          description: "Photos uploaded successfully",
        });
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("An error occurred while uploading:", error);
      toast({
        title: "Error",
        description: "Photo upload failed. Please try again",
      });
    } finally {
      setIsDialogOpen(false);
      setIsDisabled(false);
    }
  };

  return (
    <div className="h-screen flex justify-center mt-8 px-8">
      <div className="max-w-[680px] w-full space-y-6">
        <div className="pl-2 space-y-2 mb-8">
          <h1 className="text-4xl font-[500]">
            Add some photos of your Listing
          </h1>
          <p className="text-lg text-[#9d9d9d]">
            You'll need 5 photos to get started. You can add more or make
            changes later.
          </p>
        </div>
        <div className="bg-[#F7F7F7] flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-400 py-44">
          <img className="w-52 mb-4" src={camera} alt="camera icon" />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white border border-black p-5 hover:bg-[#F7F7F7]">
                {selectedImages.length > 0 || imageUrls.length > 0
                  ? "Add more photos"
                  : "Add photos"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <div className="max-h-[70vh] overflow-y-auto p-4">
                <DialogHeader>
                  <label htmlFor="file-input" className="absolute top-1 left-1">
                    <Button variant={"ghost"} asChild>
                      <span>
                        <Plus color="black" />
                      </span>
                    </Button>
                  </label>
                  <DialogTitle className="text-center">
                    Upload photos
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    {selectedImages.length + imageUrls.length === 0 ? (
                      <p>No items selected</p>
                    ) : (
                      <p>
                        {selectedImages.length + imageUrls.length} items
                        selected
                      </p>
                    )}
                  </DialogDescription>
                </DialogHeader>

                {selectedImages.length === 0 && imageUrls.length === 0 && (
                  <div className="flex flex-col border-[3px] border-dashed rounded-xl border-gray-400 items-center p-10 gap-12">
                    <div className="flex flex-col items-center gap-5 ">
                      {/* Restore your SVG */}
                      <svg
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        style={{
                          display: "block",
                          height: "72px",
                          width: "72px",
                          fill: "currentColor",
                        }}
                      >
                        <path d="M41.636 8.404l1.017 7.237 17.579 4.71a5 5 0 0 1 3.587 5.914l-.051.21-6.73 25.114A5.002 5.002 0 0 1 53 55.233V56a5 5 0 0 1-4.783 4.995L48 61H16a5 5 0 0 1-4.995-4.783L11 56V44.013l-1.69.239a5 5 0 0 1-5.612-4.042l-.034-.214L.045 14.25a5 5 0 0 1 4.041-5.612l.215-.035 31.688-4.454a5 5 0 0 1 5.647 4.256zm-20.49 39.373l-.14.131L13 55.914V56a3 3 0 0 0 2.824 2.995L16 59h21.42L25.149 47.812a3 3 0 0 0-4.004-.035zm16.501-9.903l-.139.136-9.417 9.778L40.387 59H48a3 3 0 0 0 2.995-2.824L51 56v-9.561l-9.3-8.556a3 3 0 0 0-4.053-.009zM53 34.614V53.19a3.003 3.003 0 0 0 2.054-1.944l.052-.174 2.475-9.235L53 34.614zM48 27H31.991c-.283.031-.571.032-.862 0H16a3 3 0 0 0-2.995 2.824L13 30v23.084l6.592-6.59a5 5 0 0 1 6.722-.318l.182.159.117.105 9.455-9.817a5 5 0 0 1 6.802-.374l.184.162L51 43.721V30a3 3 0 0 0-2.824-2.995L48 27zm-37 5.548l-5.363 7.118.007.052a3 3 0 0 0 3.388 2.553L11 41.994v-9.446zM25.18 15.954l-.05.169-2.38 8.876h5.336a4 4 0 1 1 6.955 0L48 25.001a5 5 0 0 1 4.995 4.783L53 30v.88l5.284 8.331 3.552-13.253a3 3 0 0 0-1.953-3.624l-.169-.05L28.804 14a3 3 0 0 0-3.623 1.953zM21 31a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM36.443 6.11l-.175.019-31.69 4.453a3 3 0 0 0-2.572 3.214l.02.175 3.217 22.894 5.833-7.74a5.002 5.002 0 0 1 4.707-4.12L16 25h4.68l2.519-9.395a5 5 0 0 1 5.913-3.587l.21.051 11.232 3.01-.898-6.397a3 3 0 0 0-3.213-2.573zm-6.811 16.395a2 2 0 0 0 1.64 2.496h.593a2 2 0 1 0-2.233-2.496zM10 13a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                      </svg>
                      <h2 className="text-2xl font-500">browse for photos</h2>
                    </div>
                    <label htmlFor="file-input">
                      <Button
                        className="text-white bg-gray-800 hover:bg-black cursor-pointer p-6 text-md"
                        asChild
                      >
                        <span>Browse</span>
                      </Button>
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Display selected images with delete button */}
                  {imageUrls.map((url, index) => (
                    <div key={`url-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Stored ${index}`}
                        className="w-full h-auto object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleDeleteImage(index, true)}
                        className="absolute top-1 right-1 bg-black rounded-full p-2 shadow-lg"
                      >
                        <Trash2 size={20} color="white" />
                      </button>
                    </div>
                  ))}

                  {selectedImages.map((image, index) => {
                    const imageUrl = URL.createObjectURL(image); // Create a URL for each file
                    return (
                      <div key={`file-${index}`} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Selected ${index}`}
                          className="w-full h-auto object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage(index, false)}
                          className="absolute top-1 right-1 bg-black rounded-full p-2 shadow-lg"
                        >
                          <Trash2 size={20} color="white" />
                        </button>
                        {index === 0 && (
                          <Button className="absolute top-1 left-1 rounded-full bg-white opacity-90 hover:bg-white">
                            Cover photo
                          </Button>
                        )}
                      </div>
                    );
                  })}

                  {/* Hidden file input */}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <Separator />
              <DialogFooter>
                <div className="flex justify-between">
                  <Button
                    className="text-md"
                    variant={"ghost"}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isDisabled}
                    className="text-white bg-gray-800 hover:bg-black cursor-pointer p-6 text-md"
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default AddPhotosPage;
