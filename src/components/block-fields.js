import {Spinner, ToolbarButton, ToolbarGroup} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import {useState, useEffect} from '@wordpress/element';
import {BlockControls} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import {seen} from '@wordpress/icons';
import {useDispatch, select} from '@wordpress/data';
import BlockComponents from "./block-components";

export default function BlockFields({name, props}) {

  const {attributes, setAttributes} = props;
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const isPostEditor = select('core/editor') !== undefined;
  const {editPost} = isPostEditor ? useDispatch('core/editor') : {};

  const onChangeAttribute = (id = null, key, value, metaName = false) => {
    setAttributes({[key]: value})
    if (editPost && false !== metaName) {
      editPost({meta: {[metaName]: value}})
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    apiFetch({path: `/${name}/v1/data`})
      .then((res) => {
        setData(res)
        setEditMode(res.edit_mode)
        res.fields.map((field) => {
          [field.name] in field && onChangeAttribute([field.name], field.value);
        });
      })
      .catch((error) => console.error(error?.message));
  }, []);

  return (
    <>
      {!data && <Spinner/>}
      {data && data.fields && data.fields.length > 0 && (
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon={!editMode ? 'edit' : seen}
              onClick={toggleEditMode}
            />
          </ToolbarGroup>
        </BlockControls>
      )}
      {data && data.fields && editMode && (
        <div className='gutengood gutengood-fields'>
          <BlockComponents
            attributes={attributes}
            components={data.fields}
            onChange={onChangeAttribute}
            props={props}
          />
        </div>
      )}
      {!editMode && (
        <ServerSideRender
          httpMethod='POST'
          block={name}
          props={props}
          attributes={props.attributes}
        />
      )}
    </>
  )
}
