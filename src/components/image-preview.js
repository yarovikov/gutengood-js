import {Button} from '@wordpress/components';
import {useSelect} from '@wordpress/data';

export const ImagePreview = ({open, remove, mediaId}) => {
  const media = useSelect((select) => select('core').getMedia(mediaId), [mediaId]);
  const mediaUrl = media?.media_details?.sizes?.thumbnail?.source_url || media?.source_url || null;
  return (
    <div className='image-component'>
      {mediaUrl
        ?
        (
          <div>
            <div>
              <img className='image-component-image' src={mediaUrl} alt=''/>
              <div className='image-component-buttons'>
                <Button
                  onClick={open}
                  icon={'edit'}
                >
                </Button>
                <Button
                  icon={'trash'}
                  onClick={remove}
                >
                </Button>
              </div>
            </div>
          </div>
        )
        :
        <Button
          className='is-primary'
          onClick={open}
        >
          Choose Image
        </Button>
      }
    </div>
  );
}
