import {
  TimePicker,
  TextControl,
  TextareaControl,
  ToggleControl,
  SelectControl,
  ColorPalette,
  ColorPicker,
  BaseControl,
  RangeControl,
} from '@wordpress/components';
import {
  MediaUpload,
  MediaUploadCheck,
  RichText,
  __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {useState, useEffect} from '@wordpress/element';
import {useSelect} from '@wordpress/data';
import {ImagePreview} from "./image-preview";
import {File} from "./file";
import {SortableList} from "./sortable-list";

export default function BlockComponents({attributes, components, onChange, props, item = null, id = null}) {

  // check if some component uses meta
  const hasMeta = components.some((component) => component.meta);
  // get meta
  const postMeta = useSelect((select) => hasMeta ? select('core/editor').getEditedPostAttribute('meta') : null);

  const [componentStates, setComponentStates] = useState({});

  // component condition
  useEffect(() => {
    const initialStates = {};
    components.forEach(component => {
      initialStates[component.name] = item ? item[component.name] : attributes[component.name];
    });
    setComponentStates(initialStates);
  }, [components, item, attributes]);

  const handleChange = (id, name, value, meta) => {
    setComponentStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    onChange(id, name, value, meta);
  };

  const shouldRenderComponent = (component) => {
    if (component.condition) {
      const condition = Array.isArray(component.condition) ? component.condition : [component.condition];
      return condition.every(con =>
        componentStates[con.name] === con.value
      );
    }
    return true;
  };

  const renderBlockComponents = (component) => {
    const componentClass = component.meta ? 'is-meta' : '';
    // get value from meta or block attributes
    const value = component.meta ? postMeta[component.name] : item ? item[component.name] : attributes[component.name];
    // this updates meta and attributes (both, if meta = true)
    const meta = component.meta ? component.name : false;

    switch (component.type) {
      case 'TimePicker':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <TimePicker
              key={component.name}
              currentDate={value}
              onChange={(value) => onChange(id, component.name, value, meta)}
              {...(component.is12hour ? {is12Hour: true} : {})}
            />
          </BaseControl>
        );
      case 'Text':
        return (
          <TextControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
            placeholder={component.placeholder}
            value={value}
            onChange={(value) => onChange(id, component.name, value, meta)}
          />
        );
      case 'Textarea':
        return (
          <TextareaControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
            placeholder={component.placeholder}
            value={value}
            onChange={(value) => onChange(id, component.name, value, meta)}
          />
        );
      case 'Toggle':
        return (
          <ToggleControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
            checked={value}
            onChange={(value) => handleChange(id, component.name, value, meta)}
          />
        );
      case 'Select':
        return (
          <SelectControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
            value={value}
            onChange={(value) => handleChange(id, component.name, value, meta)}
            options={[
              ...component.choices,
            ]}
          />
        );
      case 'ColorPalette':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <ColorPalette
              value={value}
              onChange={(value) => onChange(id, component.name, value, meta)}
              colors={[
                ...component.colors,
              ]}
              disableCustomColors={true}
              clearable={false}
            />
          </BaseControl>
        );
      case 'ColorPicker':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <ColorPicker
              key={component.name}
              color={value}
              defaultValue={value}
              onChange={(value) => handleChange(id, component.name, value, meta)}
              {...(component.alfa ? {enableAlpha: true} : {})}
            />
          </BaseControl>
        );
      case 'Image':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => onChange(id, component.name, media.id, meta)}
                allowedTypes={['image']}
                value={value}
                render={({open}) =>
                  <ImagePreview
                    open={open}
                    remove={() => onChange(id, component.name, 0, meta)}
                    componentName={component.name}
                    mediaId={value}
                  />
                }
              />
            </MediaUploadCheck>
          </BaseControl>
        );
      case 'File':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(file) => {
                  onChange(id, component.name, {
                    id: file.id ?? '',
                    name: file.filename ?? '',
                    url: file.url ?? '',
                    size: file.filesizeHumanReadable ?? '',
                  }, meta)
                }}
                value={value}
                render={({open}) =>
                  <File
                    open={open}
                    remove={() => onChange(id, component.name, {}, meta)}
                    componentName={component.name}
                    file={value}
                  />
                }
              />
            </MediaUploadCheck>
          </BaseControl>
        );
      case 'Link':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <LinkControl
              searchInputPlaceholder={component.placeholder ?? 'Search...'}
              value={value}
              onChange={(value) => onChange(id, component.name, value, meta)}
              hasTextControl
              onRemove={() => onChange(id, component.name, {}, meta)}
            />
          </BaseControl>
        );
      case 'Range':
        return (
          <RangeControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
            value={value}
            onChange={(value) => onChange(id, component.name, value, meta)}
            min={component.min ?? 300}
            max={component.max ?? 1536}
            step={component.step ?? 10}
          />
        );
      case 'RichText':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <RichText
              key={component.name}
              label={component.label}
              value={value}
              onChange={(value) => onChange(id, component.name, value, meta)}
              placeholder={component.placeholder ?? '...'}
            />
          </BaseControl>
        );
      case 'Message':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          />
        );
      case 'Repeater':
        return (
          <BaseControl
            className={componentClass}
            key={component.name}
            label={component.label}
            help={component.help}
          >
            <SortableList
              key={component.name}
              componentName={component.name}
              fields={component.fields}
              meta={meta}
              props={{...props, buttonLabel: component.button_label || 'Add'}}
            />
          </BaseControl>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {components.map((component) => {
        return shouldRenderComponent(component) ? renderBlockComponents(component) : null;
      })}
    </>
  )
}
