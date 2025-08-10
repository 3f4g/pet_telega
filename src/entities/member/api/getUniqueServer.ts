import { db } from '@/shared/api';

interface props {
  serverId: string;
  profileId: string;
}

export const getUniqueServer = async ({ serverId, profileId }: props) => {
  return db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
};
