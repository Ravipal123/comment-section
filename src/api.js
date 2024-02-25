export const getComments = async () => {
  return [
    {
      id: "1",
      body: "Hlo 1",
      username: "Ravi",
      userId: "1",
      parentId: null,
      createdAt: "2024-02-24",
    },
    {
      id: "2",
      body: "Hlo 2",
      username: "Ravi",
      userId: "2",
      parentId: null,
      createdAt: "2024-02-24",
    },
    {
      id: "3",
      body: "Hlo 1 child",
      username: "Ravi",
      userId: "2",
      parentId: "1",
      createdAt: "2024-02-24",
    },
    {
      id: "4",
      body: "Hlo 2 Child",
      username: "Ravi",
      userId: "2",
      parentId: "2",
      createdAt: "2024-02-24",
    },
  ];
};

export const createComment = async (text, parentId = null) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parentId,
    userId: "1",
    username: "Ravi",
    createdAt: new Date().toISOString(),
  };
};

export const updateComment = async (text) => {
  return { text };
};

export const deleteComment = async () => {
  return {};
};
