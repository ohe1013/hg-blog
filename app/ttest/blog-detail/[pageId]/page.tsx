import Page from "../../(.)blog-detail/[pageId]/page";

interface fetchEachPagesProps {
  params: {
    pageId: string; // pageId 추출
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  console.log("default");
  return <Page params={params} />;
};

export default fetchEachPages;
