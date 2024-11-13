import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {data, fetchNextPage, isFetching, isLoading, isError, error, hasNextPage} = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({pageParam = initialUrl}) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    }
  })
  
  if(isLoading) {
    return <div className="loading">loading...</div>
  }
  
  if(isError) {
    return <div>Error: {error.toString()}</div>
  }

  return (
    <>
      {isFetching && <div className="loading">loading...</div>}
      <InfiniteScroll
        loadMore={() => {
          if(!isFetching){
            fetchNextPage()
          }
        }}
        hasMore={hasNextPage}
      >
        {
          data.pages.map((pageData) => {
            return pageData.results.map((species) => {
              return <Species
                  key={species.name}
                  name={species.name}
                  language={species.language}
                  averageLifespan={species.average_life_span}
                />
            })
          })
        }
      </InfiniteScroll>
    </>
  );
}
