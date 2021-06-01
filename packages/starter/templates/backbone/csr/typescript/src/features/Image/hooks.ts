import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './thunk';
import { ImageState } from '../../types/Image';

// eslint-disable-next-line import/prefer-default-export
export const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector<{
    image: ImageState;
  }, ImageState>((state) => state.image);

  useEffect(() => {
    dispatch(fetchImage());
  }, []);

  return [loading, error, url];
};
