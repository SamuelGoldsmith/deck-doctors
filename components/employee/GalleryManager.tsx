"use client";

import { useCallback, useState } from "react";
import { CheckCircle2, ImageIcon, Plus } from "lucide-react";
import {
  addGalleryGroup,
  updateGalleryGroup,
  deleteGalleryGroup,
  reorderGalleryGroups,
  getGalleryGroupsClient,
  type GalleryGroup,
  type GalleryGroupInput,
} from "@/lib/utils";
import { GalleryGroupForm } from "@/components/employee/gallery/GalleryGroupForm";
import { GroupRow } from "@/components/employee/gallery/GroupRow";

interface GalleryManagerProps {
  initialGroups: GalleryGroup[];
}

export default function GalleryManager({ initialGroups }: GalleryManagerProps) {
  const [groups, setGroups] = useState<GalleryGroup[]>(initialGroups);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 3500);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setGroups(await getGalleryGroupsClient());
    } catch {
      /* keep current list; the mutation already succeeded */
    }
  }, []);

  const handleCreate = useCallback(
    async (input: GalleryGroupInput): Promise<boolean> => {
      const { ok } = await addGalleryGroup(input);
      if (!ok) return false;
      await refresh();
      flash("Job published to the gallery.");
      return true;
    },
    [refresh, flash]
  );

  const handleUpdate = useCallback(
    async (input: GalleryGroupInput): Promise<boolean> => {
      const ok = await updateGalleryGroup(input);
      if (!ok) return false;
      await refresh();
      setEditingId(null);
      flash("Job updated.");
      return true;
    },
    [refresh, flash]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      // deleteGalleryGroup shows its own confirm().
      const ok = await deleteGalleryGroup(id);
      if (!ok) return;
      setGroups((prev) => prev.filter((g) => g.id !== id));
      if (editingId === id) setEditingId(null);
      flash("Job deleted.");
    },
    [editingId, flash]
  );

  const moveGroup = useCallback(
    async (id: string, dir: -1 | 1) => {
      const idx = groups.findIndex((g) => g.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= groups.length) return;

      const prev = groups;
      const next = [...groups];
      [next[idx], next[target]] = [next[target], next[idx]];
      setGroups(next); // optimistic
      setReordering(true);
      const ok = await reorderGalleryGroups(next.map((g) => g.id));
      setReordering(false);
      if (!ok) {
        setGroups(prev);
        flash("Could not save the new order.");
      }
    },
    [groups, flash]
  );

  return (
    <div className="space-y-8">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-card">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {toast}
        </div>
      )}

      {/* Create */}
      <section className="card space-y-5 p-5 shadow-card sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
            <Plus className="size-4" aria-hidden />
          </span>
          <h2 className="font-display text-h3 font-semibold text-primary">New job</h2>
        </div>
        <GalleryGroupForm onSubmit={handleCreate} />
      </section>

      {/* Manage */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-h3 font-semibold text-primary">
            Published jobs{" "}
            <span className="text-base font-normal text-muted-foreground">({groups.length})</span>
          </h2>
        </div>

        {groups.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center shadow-card">
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium text-foreground">No jobs yet</p>
            <p className="text-xs text-muted-foreground">
              Add your first job above and it will show up here and on the public gallery.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {groups.map((group, index) =>
              editingId === group.id ? (
                <li key={group.id} className="card space-y-5 p-5 shadow-card sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-h3 font-semibold text-primary">Editing job</h3>
                  </div>
                  <GalleryGroupForm
                    group={group}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <GroupRow
                  key={group.id}
                  group={group}
                  index={index}
                  total={groups.length}
                  busy={reordering || editingId !== null}
                  onEdit={(g) => setEditingId(g.id)}
                  onDelete={handleDelete}
                  onMove={moveGroup}
                />
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
