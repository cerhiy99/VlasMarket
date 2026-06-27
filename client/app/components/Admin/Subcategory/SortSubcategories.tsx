'use client';

import React, { useEffect, useState } from 'react';
import './SortSubcategories.scss';
import { $authHost, $host } from '@/app/http';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

interface Subcategory {
  id: number;
  nameru: string;
  nameuk: string;
  img: string;
  sort: number | null;
  categoryNameRu: string;
}

const SortItem = ({ item }: { item: Subcategory }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="row">
      <div className="drag" {...attributes} {...listeners}>
        ☰
      </div>

      <img src={process.env.NEXT_PUBLIC_SERVER + item.img} alt="" />

      <div className="info">
        <b>{item.nameru}</b>
        <span>{item.categoryNameRu}</span>
      </div>
    </div>
  );
};

export default function SortSubcategories() {
  const [items, setItems] = useState<Subcategory[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const getSubcategories = async () => {
    const res = await $host.get(
      'category/getCategoryAndSubcategoryWithProduct'
    );

    const result =
      res.data.category?.flatMap(
        (cat: any) =>
          cat.subcategories?.map((sub: any) => ({
            ...sub,
            categoryNameRu: cat.nameru,
          })) ?? []
      ) ?? [];

    setItems(result);
  };

  useEffect(() => {
    getSubcategories();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);

    // перерахунок sort (10,20,30 щоб легко вставляти нові)
    const updated = newItems.map((item, index) => ({
      ...item,
      sort: (index + 1) * 10,
    }));

    setItems(updated);

    try {
      await $authHost.patch('subcategory/reorder', {
        items: updated.map((i) => ({
          id: i.id,
          sort: i.sort,
        })),
      });
    } catch (e) {
      alert('Помилка збереження сортування');
    }
  };

  return (
    <div className="sort-subcategories-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
