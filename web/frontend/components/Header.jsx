import {Frame, ContextualSaveBar} from '@shopify/polaris';
import React from 'react';

export default function Header() {
  return (
    <div >
      <Frame
        logo={{
          width: 124,
          contextualSaveBarSource:
            'https://cdn.shopify.com/shopifycloud/web/assets/v1/f5416ec27e17f00a67f8c2d6603088baa6635c7bc2071b4f6533c8d260fc8644.svg',
        }}
      >
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction: () => console.log('add form submit logic'),
            loading: false,
            disabled: false,
          }}
          discardAction={{
            onAction: () => console.log('add clear form logic'),
          }}
        />
      </Frame>
    </div>
  );
}