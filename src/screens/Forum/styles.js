import { StyleSheet, Dimensions } from 'react-native'
const WIDTH = Dimensions.get('window').width * 0.95;

export const styles = StyleSheet.create({
    button: {
        height: 40,
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
        flex: 1,
        justifyContent: "center", alignItems: "center",
        shadowColor: "gray",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    buttonDraft: {
        height: 40,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
        flex: 1,
        justifyContent: "center", alignItems: "center",
    }
    ,
    floatingButton: {
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        position: 'absolute',
        bottom: 70,
        right: 26,
        height: 44,
        // backgroundColor: '#F8931D',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    row: { flexDirection: "row", alignItems: "center" },
    rounded: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 36, borderRadius: 38,
        marginHorizontal: 5,
        width: "auto",
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    roundedSearch: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        borderRadius: 38,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 5
    },

    h6: {
        fontSize: 16
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 0,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
    section: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    navigationContainer: {
        backgroundColor: "#ecf0f1"
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: "center"
    },
    section: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    input: {
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#F18910",
        height: 40,
        borderRadius: 10,
        color: "black",
        // width: "90%"

    },
    searchBar: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#F18910",
        width: "90%",
        borderRadius: 10,
        marginTop: 10
    },
    container: {
        width: WIDTH,
    },
    logo: {
        width: "90%",
        height: 125,
        borderRadius: 10,
        resizeMode: "cover",
    },
    categoryImage: {
        marginVertical: 10,
        width: 100,
        height: 100,
        resizeMode: "contain",
        backgroundColor: "#F6F6F6",
        borderRadius: 5
    },
    containerCategory: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },
    produkImage: {
        marginVertical: 20,
        width: "30%",
        height: 120,
        borderRadius: 10,
        resizeMode: "cover",
        backgroundColor: "#F6F6F6"
    },
    card: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#FFFFFF",
        height: "auto",
        width: "40%",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    profil: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    description: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "400"
    },
    sectionRow: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 5
    }
})


export const stylesDetail = StyleSheet.create({
    button: {
        borderRadius: 10,
        marginTop: 10,
        flex: 1,
        justifyContent: "center", alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    row: { flexDirection: "row", alignItems: "center" },
    borderGray: {
        borderColor: "gray",
        borderWidth: 1,
        backgroundColor: "#FFF"
    },
    rounded: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 40, borderRadius: 50, marginHorizontal: 5,
        backgroundColor: "#F5F5F5",
        maxWidth: 100,
    },
    roundedCategory: {
        height: 30, borderRadius: 20, marginHorizontal: 5,
        backgroundColor: "#F5F5F5",
        maxWidth: 120,
        padding: 5,
        marginVertical: 5
    },

    h6: {
        fontSize: 16
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 0,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
    section: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    navigationContainer: {
        backgroundColor: "#ecf0f1"
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: "center"
    },
    section: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    input: {
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#F18910",
        height: 40,
        borderRadius: 10,
        color: "black",
        // width: "90%"

    },
    searchBar: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#F18910",
        width: "90%",
        borderRadius: 10,
        marginTop: 10
    },
    containerCategory: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },
    container: {
        margin: 0,
        width: WIDTH,
    },
    logo: {
        width: "90%",
        height: 125,
        borderRadius: 10,
        resizeMode: "cover",
    },
    banner: {
        marginVertical: 10,
        width: "100%",
        height: 181,
        resizeMode: "contain",
        backgroundColor: "#F6F6F6",
        borderRadius: 5
    },
    produkImage: {
        marginVertical: 20,
        width: "30%",
        height: 120,
        borderRadius: 10,
        resizeMode: "cover",
        backgroundColor: "#F6F6F6"
    },
    card: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    cardComment: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    cardQuote: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    profil: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    description: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "400"
    },
    sectionRow: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 5
    }
})