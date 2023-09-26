import React, { useState } from 'react';

import { NavModelItem } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Page } from 'app/core/components/Page/Page';

import { LinkSettingsEdit, LinkSettingsList } from '../LinksSettings';
import { newLink } from '../LinksSettings/LinkSettingsEdit';

import { SettingsPageProps } from './types';

export type LinkSettingsMode = 'list' | 'new' | 'edit';

export function LinksSettings({ dashboard, sectionNav, editIndex }: SettingsPageProps) {
  const [isNew, setIsNew] = useState<boolean>(false);

  const onGoBack = () => {
    setIsNew(false);
    locationService.partial({ editIndex: undefined });
  };

  const onNew = () => {
    dashboard.links = [...dashboard.links, { ...newLink }];
    setIsNew(true);
    locationService.partial({ editIndex: dashboard.links.length - 1 });
  };

  const onEdit = (idx: number) => {
    setIsNew(false);
    locationService.partial({ editIndex: idx });
  };

  const isEditing = editIndex !== undefined;

  let pageNav: NavModelItem | undefined = sectionNav.node.parentItem;
  if (isEditing) {
    const title = isNew ? 'New link' : 'Edit link';
    const description = isNew ? 'Create a new link on your dashboard' : 'Edit a specific link of your dashboard';
    pageNav = {
      text: title,
      subTitle: description,
      parentItem: pageNav,
    };
  }

  return (
    <Page navModel={sectionNav} pageNav={pageNav}>
      {!isEditing && <LinkSettingsList dashboard={dashboard} onNew={onNew} onEdit={onEdit} />}
      {isEditing && <LinkSettingsEdit dashboard={dashboard} editLinkIdx={editIndex} onGoBack={onGoBack} />}
    </Page>
  );
}
