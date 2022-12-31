import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  LockMinor
} from '@shopify/polaris-icons';
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
  TextStyle,
  Banner
} from "@shopify/polaris";
import TabsCard from "../components/Tabs";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [dataPage, setDataPage] = useState();
  const [itemSort, setItemSort] = useState([]);

  const callApi = async () => {
    const res = await fetch('/api/pages/get/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    const data = await res.json();
    // setItemSort(
    //   data.map((item) => ({
    //     id: item.id,
    //     title: item.title,
    //     handle: item.handle,
    //     published_at: item.published_at,
    //     body: item.body_html,
    //     updated_at: item.updated_at,
    //   }))
    // );
    setDataPage(data);
    console.log(data);
  }

  useEffect(()=>{
    callApi();
  }, [])


  return (
    <Page
      fullWidth
      title="Pages"
      primaryAction={{
        content: "Add page",
        onAction: () => navigate("/NewPage"),
      }}
    >
      <Layout>
        {/* <Layout.Section>
          {loadingMarkup}
          {emptyStateMarkup}
        </Layout.Section> */}
        <Layout.Section>
          <Banner
            title="Store access is restricted"
            status="warning"
            action={{ content: 'View store password.', url: 'https://admin1002.myshopify.com/admin/online_store/preferences?tutorial=unlock' }}
            icon={LockMinor}
          >
            <p>
              When your online store is in beta, only visitors with a password can access the online store.
            </p>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <TabsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
