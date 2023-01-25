import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import Container from '~/components/Screens/Container';
import { cls } from '~/utils/functions';
import styles from './PhotoUpload.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useTranslation } from 'next-export-i18n';
import { maxImageWidth, maxImageHeight, maxFileSize } from '~/utils/constants';

enum UNIT {
  PX = 'px',
  PRO = '%',
}

type CROP = {
  unit: UNIT;
  width: number;
  // aspect: number
};

interface PhotoUploadProps {
  index: number;
  photo?: File;
  isFirstPhoto?: boolean;
  handlePhoto(index: number, photo: File): void;
  isLoading: boolean;
  imageName?: string;
}

const PhotoUpload: FC<PhotoUploadProps> = (props: PhotoUploadProps) => {
  const { t } = useTranslation();

  const initCrop = {
    unit: UNIT.PRO,
    width: 60,
    height: 60,
    x: 20,
    y: 20,
    // aspect: 16 / 9
  };

  const { photo, isFirstPhoto, handlePhoto, index, isLoading, imageName } = props;
  const [upImg, setUpImg] = useState<string | ArrayBuffer | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState<CROP>(initCrop);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState<File>(null);
  const [maxWidth, setMaxWidth] = useState(false);
  const [maxHeight, setMaxHeight] = useState(false);
  const [maxSize, setMaxSize] = useState(false);

  useEffect(() => {
    const closeModal = e => {
      if (e.target.classList[0] === 'modal-wrap') {
        setShowModal(false);
        fileRef.current.value = null;
      }
    };

    document.body.addEventListener('click', closeModal);

    if (photo) {
      handleFile(photo);
    }
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    if (crop.height) {
      if (canvas.width > maxImageWidth) setMaxWidth(true);

      if (canvas.height > maxImageHeight) setMaxHeight(true);
    }

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'low';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const generateImageUrl = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(
      blob => {
        try {
          setCroppedImageUrl(URL.createObjectURL(blob));
          const file = new File([blob], `${index}-${photo ? photo.name : newImage.name}`);

          if (file.size > maxFileSize) setMaxSize(true);
          else handlePhoto(index, file);
        } catch (e) {
          console.log(e, 'error');
        }
      },
      'image/jpeg',
      1
    );
  };

  const handleCrop = c => {
    setCrop(c);
    setMaxWidth(false);
    setMaxHeight(false);
  };

  const handleFile = (file: File) => {
    if (file) {
      const reader = new FileReader();

      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(file);
      setShowModal(true);
      setMaxSize(false);
    } else {
      setUpImg(null);
      setShowModal(false);
      setMaxSize(true);
    }

    fileRef.current.value = null;
  };

  const onPhotoChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      setNewImage(img);

      handleFile(event.target.files[0]);
    }
  };

  const removePhoto = () => {
    setCroppedImageUrl(null);
    imgRef.current = null;
    setUpImg(null);
    setCrop(initCrop);
    handlePhoto(index, null);
    setMaxSize(false);
    fileRef.current.value = null;
  };

  const onCropComplete = crop => {
    setCompletedCrop(crop);
    fileRef.current.value = null;
  };

  const setResize = () => {
    if (!maxWidth && !maxHeight) {
      generateImageUrl(previewCanvasRef.current, completedCrop);
      setShowModal(false);
    }
  };

  return (
    <Container className={cls(['px-1 mb-2', isFirstPhoto ? 'w-full h-uploadMain' : 'w-1/2 h-uploadSub'])}>
      <div className="relative rounded-lg overflow-hidden border border-black border-dashed border-opacity-20 w-full h-full">
        {!photo && !imageName && !maxSize && (
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center rounded-lg">
            <div className="text-center">
              {!photo && <i className={cls(['fa fa-upload mb-2', styles.uploadIcon])}></i>}
            </div>
          </div>
        )}
        <div className="absolute">
          <canvas
            ref={previewCanvasRef}
            style={{
              visibility: 'hidden',
            }}
          />
        </div>
        {croppedImageUrl ? (
          photo && <img className="w-full object-cover h-full" src={croppedImageUrl} />
        ) : imageName ? (
          <img className="w-full object-cover h-full" src={imageName} />
        ) : (
          <></>
        )}
        <input
          type="file"
          name="photo"
          ref={fileRef}
          className="w-full h-full opacity-0 cursor-pointer"
          onChange={onPhotoChange}
        />
        {maxSize && (
          <div className="flex justify-center items-center absolute bottom-0 bg-white bg-opacity-70 py-1 px-4 w-full">
            <div className="text-12 text-danger font-semibold">{t('listing.OVER_SIZE')}</div>
          </div>
        )}
        {(((photo || imageName) && !isLoading) || maxSize) && (
          <div className="bg-white py-2 px-3 rounded-full cursor-pointer absolute top-4 right-4" onClick={removePhoto}>
            <i className={cls(['fa fa-trash', styles.trashIcon])}></i>
          </div>
        )}
        {isLoading && <div className="w-full h-full absolute left-0 top-0 bg-black bg-opacity-30"></div>}
        {isLoading && (
          <div
            className={cls([
              'flex justify-center items-center absolute left-0 top-0 w-full h-full text-white',
              styles.spiiner,
            ])}
          >
            <i className="fa fa-spinner fa-spin"></i>
          </div>
        )}
        {showModal && (
          <div className="modal-wrap fixed z-50 left-0 top-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-60">
            <div className={cls(['w-2/3 z-10 relative rounded-md overflow-hidden', styles.modalWrap])}>
              <div className="flex justify-between py-2">
                <div className="pt-1.5">
                  {(maxWidth || maxHeight) && (
                    <div className="text-12 font-semibold text-danger">{t('listing.OVER_RESOLUTION')}</div>
                  )}
                </div>
                <div
                  className="bg-auth text-white text-14 font-medium capitalize py-1 px-4 rounded-md cursor-pointer"
                  onClick={setResize}
                >
                  {t('listing.SAVE')}
                </div>
              </div>
              <ReactCrop
                src={upImg?.toString()}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={c => {
                  handleCrop(c);
                }}
                onComplete={c => onCropComplete(c)}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PhotoUpload;
