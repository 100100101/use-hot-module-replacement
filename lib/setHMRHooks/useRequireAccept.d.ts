type RequireAcceptReturn = {
    value: any;
    callback: any;
};
type RequireAccept = (path: string) => RequireAcceptReturn;
declare const useRequireAccept: ({ accept }: {
    accept: any;
}) => RequireAccept;
export default useRequireAccept;
