import {useState, useEffect} from '@wordpress/element';
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {Button, BaseControl} from '@wordpress/components';
import {useDispatch, useSelect} from '@wordpress/data';
import {SortableItem} from "./sortable-item";

export const SortableList = ({componentName, fields, meta, props}) => {

  const {
    attributes,
    setAttributes,
  } = props;

  const postMeta = useSelect((select) => meta ? select('core/editor').getEditedPostAttribute('meta') : null);

  const items = meta ? postMeta[componentName] : attributes[componentName];
  const [sortableItems, setSortableItems] = useState([]);
  const {editPost} = useDispatch('core/editor');

  useEffect(() => {
    const fieldNames = new Set(fields.map(field => field.name));

    const updatedItems = items.map(item => {
      const updatedItem = {id: item.id};

      Object.keys(item).forEach(key => {
        if (fieldNames.has(key) || key === 'id') {
          updatedItem[key] = item[key];
        }
      });

      fieldNames.forEach(fieldName => {
        if (!(fieldName in updatedItem)) {
          updatedItem[fieldName] = '';
        }
      });

      return updatedItem;
    });

    setSortableItems(updatedItems);
  }, [items, fields]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const moveItem = (activeId, overId) => {
    const activeIndex = sortableItems.findIndex((item) => item.id === activeId);
    const overIndex = sortableItems.findIndex((item) => item.id === overId);

    if (activeIndex !== overIndex) {
      const newItems = arrayMove(sortableItems, activeIndex, overIndex);
      setSortableItems(newItems);
      if (false !== meta) {
        editPost({meta: {[meta]: newItems}})
      } else {
        setAttributes({[componentName]: newItems});
      }
    }
  };

  const addItem = (fields) => {
    const newItem = {
      id: `${Date.now()}`,
    };
    fields.forEach(field => {
      newItem[field.name] = field.value;
    });

    const newItems = [...sortableItems, newItem];
    setSortableItems(newItems);
    if (false !== meta) {
      editPost({meta: {[meta]: newItems}})
    } else {
      setAttributes({[componentName]: newItems});
    }
  };

  const deleteItem = (id) => {
    const newItems = sortableItems.filter((item) => item.id !== id);
    setSortableItems(newItems);
    if (false !== meta) {
      editPost({meta: {[meta]: newItems}})
    } else {
      setAttributes({[componentName]: newItems});
    }
  };

  const updateItemContent = (id, name, value) => {
    const newItems = sortableItems.map((item) =>
      item.id === id ? {...item, [name]: value} : item
    );
    setSortableItems(newItems);
    if (false !== meta) {
      editPost({meta: {[meta]: newItems}})
    } else {
      setAttributes({[componentName]: newItems});
    }
  };

  return (
    <BaseControl>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const {active, over} = event;
          if (active && over) {
            moveItem(active.id, over.id);
          }
        }}
      >
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <div className='repeater-component'>
            {sortableItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                fields={fields}
                updateItemContent={updateItemContent}
                deleteItem={deleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        isPrimary
        onClick={() => addItem(fields)}
        className='repeater-component-add-item-button'
      >
        {props.buttonLabel}
      </Button>
    </BaseControl>
  );
}
