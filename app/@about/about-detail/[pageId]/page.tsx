import Page from "../../(.)about-detail/[pageId]/page";

interface fetchEachPagesProps {
  params: {
    pageId: string; // pageId 추출
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  console.log("about-fetchPage");
  return <Page params={params} />;
};

export default fetchEachPages;
