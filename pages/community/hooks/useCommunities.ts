import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { COMUNITIES_QUERY } from '~/utils/graphql';

export type Community = {
  id: number;
  name: string;
  createdBy: {
    name: string;
  };
  isActive: boolean;
};

export default function useCommunities() {
  const [communities, setCommunities] = useState<Array<Community>>([]);
  const communitiesData = useQuery(COMUNITIES_QUERY);

  useEffect(() => {
    if (communitiesData.data) {
      let communitiesNew = [];

      communitiesData.data.getCommunities.data.map(community => {
        const communityItem = {
          id: community.id,
          name: community.name,
          createdBy: community.createdBy,
          isActive: community.isActive,
        };

        communitiesNew.push(communityItem);
      });

      setCommunities(communitiesNew);
    }
  }, [communitiesData.data]);

  return communities;
}
