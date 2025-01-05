import {registerBlockType} from '@wordpress/blocks';
import {registerPlugin} from '@wordpress/plugins';
import {PluginDocumentSettingPanel} from '@wordpress/editor';
import {Fragment} from '@wordpress/element';
import {useSelect} from '@wordpress/data';
import BlockOptions from "./components/block-options";
import BlockFields from "./components/block-fields";
import PanelOptions from "./components/panel-options";

if ('undefined' !== typeof window.gutengoodBlocks) {
  window.gutengoodBlocks.forEach(block => {
    const name = block.name;
    registerBlockType(name, {
      title: block.title,
      icon: getIcon(block.icon),
      description: block.description,
      category: block.category,
      edit: (props) => (
        <Fragment>
          <BlockOptions name={name} props={props}/>
          <BlockFields name={name} props={props}/>
        </Fragment>
      ),
      save: () => null,
    });
  });
}

if ('undefined' !== typeof window.gutengoodPanels) {
  const GutengoodPluginDocumentSettingPanel = (panel) => {
    const postType = useSelect(select => select('core/editor').getCurrentPostType());
    if (!panel.post_types.includes(postType)) {
      return null;
    }

    return (
      <PluginDocumentSettingPanel
        name={panel.name}
        title={panel.title}
      >
        <PanelOptions name={panel.name} />
      </PluginDocumentSettingPanel>
    );
  }

  window.gutengoodPanels.forEach(panel => {
    registerPlugin(panel.name, {
      render: () => GutengoodPluginDocumentSettingPanel(panel),
      icon: getIcon(panel.icon),
    })
  });
}

function getIcon(icon) {
  if (!icon || typeof icon !== 'string' || !icon.includes('"svg"')) {
    return icon
  }

  const json = JSON.parse(icon);
  const {svg} = json;
  const paths = svg.paths
    ? svg.paths.map((path, index) => (
      <path
        key={index}
        fill={path['@attributes'].fill}
        d={path['@attributes'].d}
      />
    ))
    : (
      <path
        fill={svg.path['@attributes'].fill}
        d={svg.path['@attributes'].d}
      />
    );

  return (
    <svg
      width={svg['@attributes'].width}
      height={svg['@attributes'].height}
      viewBox={svg['@attributes'].viewBox}
    >
      {paths}
    </svg>
  );
}
