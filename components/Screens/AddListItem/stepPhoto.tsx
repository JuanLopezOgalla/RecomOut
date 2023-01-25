import { useLazyQuery } from '@apollo/client';
import { Button } from 'antd';
import axios from 'axios';
import { useTranslation } from 'next-export-i18n';
import React, { useEffect, useState } from 'react';
import { cls } from '~/utils/functions';
import { GET_PRESIGNED_POST } from '~/utils/graphql';
import { FileUpload } from '../MainSlider';
import PhotoUpload from '../PhotoUpload';

const StepPhoto = ({
  isActive,
  photos,
  handlePhotos,
  handleBack,
  handleNext,
}: {
  isActive: boolean;
  photos: FileUpload[];
  handlePhotos: (files: FileUpload[]) => void;
  handleBack: () => void;
  handleNext: () => void;
}) => {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState<FileUpload | null>(null);

  const [getPresignedUrl, { data }] = useLazyQuery(GET_PRESIGNED_POST);

  const handleMainPhoto = event => {
    if (event.target.files && event.target.files[0]) {
      handlePhoto(0, event.target.files[0]);
    }
  };

  const handlePhoto = (index: number, file: File) => {
    if (photos.some(el => el.loading)) {
      return;
    }

    if (file) {
      setUploadFile({ id: index, file, loading: true });
      getPresignedUrl({ variables: { name: file.name } });

      if (photos.length > 0 && photos.some(el => el.id === index)) {
        handlePhotos(photos.map(pl => (pl.id === index ? { ...pl, file, loading: true } : pl)));
      } else {
        handlePhotos([...photos, { id: index, file, loading: true }]);
      }
    } else {
      handlePhotos(photos.map(pl => (pl.id === index ? { ...pl, file: undefined, loading: false } : pl)));
    }
  };

  useEffect(() => {
    const uploadS3 = async (data: any) => {
      if (data) {
        const filename = uploadFile.file.name;
        const formData = new FormData();

        formData.append('bucket', data.fields.bucket);
        formData.append('key', data.fields.key.replace('${filename}', filename));
        formData.append('policy', data.fields.policy);
        formData.append('X-Amz-Algorithm', data.fields.algorithm);
        formData.append('X-Amz-Credential', data.fields.credential);
        formData.append('X-Amz-Date', data.fields.date);
        formData.append('X-Amz-Signature', data.fields.signature);
        formData.append('file', uploadFile.file as unknown as Blob);

        try {
          const response = await axios({
            method: 'post',
            url: data.url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (response.status === 204) {
            handlePhotos(
              photos.map(el => (el.id === uploadFile.id ? { ...el, file: uploadFile.file, loading: false } : el))
            );
          } else {
            handlePhotos(photos.map(el => (el.id === uploadFile.id ? { ...el, file: undefined, loading: false } : el)));
          }

          setUploadFile(null);
        } catch (error) {
          console.error(error);
          handlePhotos(photos.map(el => (el.id === uploadFile.id ? { ...el, file: undefined, loading: false } : el)));
          setUploadFile(null);
        }
      }
    };

    if (data && uploadFile) {
      uploadS3(data.getS3PresignedPost);
    }
  }, [data, uploadFile]);

  const onNext = () => {
    if (photos.some(el => !el.file)) return;

    handleNext();
  };

  return (
    <div
      className={cls([
        'flex flex-col justify-center items-center w-full h-photoGallery overflow-y-auto mt-20',
        isActive ? 'block' : 'hidden',
      ])}
    >
      {photos.filter(el => el.file).length === 0 ? (
        <div className="mt-6 flex h-uploadMain w-full relative">
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center border border-solid border-black border-opacity-10 rounded-lg">
            <div className="text-center">
              <i className="fa fa-upload mb-2 text-lg"></i>
              <div className="text-18 text-black font-bold">{t('post.UPLOAD_YOUR_PHOTOS')}</div>
              <div className="text-14 text-black font-medium">{t('post.ADD_AT_LEAST')}</div>
            </div>
          </div>
          <input
            type="file"
            name="photo"
            className="w-full h-full opacity-0 cursor-pointer"
            onChange={handleMainPhoto}
          />
        </div>
      ) : (
        <div className="w-full lg:w-sellProperty h-full">
          <PhotoUpload
            index={0}
            photo={photos[0].file}
            isLoading={photos[0].loading}
            handlePhoto={handlePhoto}
            isFirstPhoto={true}
          />
          <div className="flex flex-wrap mt-2">
            {photos.map((photo, index) => {
              if (index)
                return (
                  <PhotoUpload
                    index={index}
                    photo={photo.file}
                    isLoading={photo && photo.loading}
                    handlePhoto={handlePhoto}
                  />
                );
            })}
          </div>
        </div>
      )}

      <div className="handleWrap absolute bottom-0 w-full border-t border-solid border-black border-opacity-10">
        <div className="px-4 md:px-12 py-6 flex justify-between">
          <Button type="default" onClick={handleBack}>
            {t('post.BACK')}
          </Button>
          <Button type="primary" onClick={onNext}>
            {t('post.NEXT')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepPhoto;
