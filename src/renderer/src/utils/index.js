import { v4 as uuidv4 } from "uuid";

export const getId = () => {
  return uuidv4();
};

export const parseProxiesArray = (proxies) => {
  const arrOfStr = proxies?.map(
    (item) => `${item?.proxy}:${item?.username}:${item?.password}`,
  );
  return arrOfStr?.join("\n");
};

export const proxiesStrToArray = (proxies) => {
  const tempArr = proxies?.split(":");

  if (tempArr?.length === 4)
    return {
      id: getId(),
      proxy: tempArr[0] + ":" + tempArr[1],
      username: tempArr[2],
      password: tempArr[3],
    };
  else return null;
};

export const multipleProxiesStrToArr = (proxies) => {
  if (!proxies) return [];
  proxies = proxies?.split("\n");
  if (proxies?.length <= 0) return [];
  proxies =
    proxies
      ?.map((proxyStr) => {
        if (proxyStr) {
          const tempArr = proxyStr?.split(":");
          if (tempArr.length) {
            return {
              id: getId(),
              proxy: tempArr[0] + ":" + tempArr[1],
              username: tempArr[2],
              password: tempArr[3],
            };
          } else return false;
        } else return false;
      })
      ?.filter((acc) => acc) ?? [];
  return proxies;
};

export const proxiesArrayToStr = (proxies) => {
  if (proxies?.length > 0) {
    return (
      proxies
        ?.map(
          (proxyObj) =>
            `${proxyObj?.proxy}:${proxyObj?.username}:${proxyObj?.password}`,
        )
        ?.join("\n") ?? ""
    );
  } else return "";
};
