import {Button, Icon} from '@wordpress/components';

const FileIcon = () => (
  <Icon
    icon={() => (
      <svg className='file-component-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M380.7 67.3c-29.1-29.1-76.3-29.1-105.4 0l-192 192c-46.8 46.8-46.8 122.6 0 169.4s122.6 46.8 169.4 0l152-152c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-152 152c-59.3 59.3-155.4 59.3-214.6 0S1.4 296 60.7 236.7l192-192c41.6-41.6 109-41.6 150.6 0s41.6 109 0 150.6L219.5 379.1c-28.2 28.2-74.6 25.6-99.6-5.5c-21.3-26.6-19.2-65 4.9-89.1L276.7 132.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L147.5 307.1c-12.6 12.6-13.7 32.6-2.6 46.5c13 16.2 37.2 17.6 51.9 2.9L380.7 172.7c29.1-29.1 29.1-76.3 0-105.4z"/>
      </svg>
    )}
  />
);

export const File = ({open, remove, file}) => {
  return (
    <div className='file-component'>
      <FileIcon/>
      {file && file.id
        ?
        (
          <div className='file-component-info'>
            <div>
              <span className='file-component-info-name'>
                {file.name}
              </span>
              <span className='file-component-info-size'>
                {file.size}
              </span>
            </div>
            <Button
              icon={'trash'}
              onClick={remove}
            >
            </Button>
          </div>
        )
        :
        <Button
          onClick={open}
        >
          Select File
        </Button>
      }
    </div>
  );
}