import {Card, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import ResourceListItem from './ResourceListItem';
export default function TabsCard() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'all-customers-4',
      content: 'All',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-4',
    }
  ];

  return (
    <Card>
      <Tabs
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
        disclosureText="More views"
      >
        <Card.Section >
          <ResourceListItem />
        </Card.Section>
      </Tabs>
    </Card>
  );
}