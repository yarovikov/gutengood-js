import {Spinner} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import {useState, useEffect} from '@wordpress/element';
import {useDispatch} from '@wordpress/data';
import BlockComponents from "./block-components";

export default function PanelOptions({name}) {

  const [data, setData] = useState([]);
  const {editPost} = useDispatch('core/editor');

  const onChangeAttribute = (id = null, key, value, metaName = true) => {
    editPost({meta: {[metaName]: value}})
  };

  useEffect(() => {
    apiFetch({path: `/${name}/v1/data`})
      .then((res) => {
        setData(res)
        res.options.map((option) => {
          [option.name] in option && onChangeAttribute([option.name], option.value);
        });
      })
      .catch((error) => console.error(error?.message));
  }, []);

  return (
    <>
      {!data && <Spinner/>}
      {data && data.options && data.options.length > 0 && (
        data.options.map((section, index) => {
          return (
            <div key={index} className='gutengood gutengood-panel gutengood-options'>
              <BlockComponents
                attributes={section.fields}
                components={section.fields}
                onChange={onChangeAttribute}
              />
            </div>
          );
        })
      )}
    </>
  )
}
