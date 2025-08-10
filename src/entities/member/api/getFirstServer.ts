import { db } from '@/shared/api';

interface props {
  profileId: string;
}

export const getFirstServer = async ({ profileId }: props) => {
  return db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
};
