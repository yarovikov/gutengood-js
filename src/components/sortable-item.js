import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {closeSmall, dragHandle, plus} from '@wordpress/icons';
import {Button} from '@wordpress/components';
import {useState} from '@wordpress/element';
import BlockComponents from "./block-components";

export const SortableItem = ({id, item, fields, updateItemContent, deleteItem}) => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform && {...transform, scaleY: 1}),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='repeater-component-item'
    >
      <div className='repeater-component-item-buttons'>
        <Button
          {...attributes}
          {...listeners}
          icon={dragHandle}
        >
        </Button>
        <Button
          icon={isCollapsed ? plus : 'minus'}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
        </Button>
        <Button
          isDestructive
          onClick={() => deleteItem(id)}
          icon={closeSmall}
        >
        </Button>
      </div>
      <div className={`${isCollapsed ? 'is-collapsed ' : ''}repeater-component-item-components`}>
        <BlockComponents
          attributes={attributes}
          components={fields}
          onChange={updateItemContent}
          item={item}
          id={id}
        />
      </div>
    </div>
  );
}
