import { StyleSheet, Dimensions } from 'react-native';
import convertCSS from '../../../helpers/convertCSS';

const WIDTH = Dimensions.get('window').width * 0.95; //95%
const MARGINWIDTH = Dimensions.get('window').width * 0.025; //2.5%

export const generalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    boxShadowContainer: {
        width: WIDTH,
        marginLeft: '2.5%',
        padding: 5,
        marginTop: 10,
        borderWidth: 0.1, //1
        borderColor: '#e6e6e6',
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        backgroundColor: "#FFFFFF",
        
        shadowColor: "#5c5b5b", //#000
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 5,
    },
    shadowButton: {
        backgroundColor: '#F8931D',
        width: WIDTH,
        marginLeft: '2.5%',
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 5,
    },
    shadowButtonWhite: {
        backgroundColor: '#F7F7F7',
        width: WIDTH,
        marginLeft: '2.5%',
        bottom: '10%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 5,
    },
    shadowButtonDisabled: {
        backgroundColor: 'grey',
        width: WIDTH,
        marginLeft: '2.5%',
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 5,
    },
    sectionTitle: {
        marginTop: 10,
        color: 'black',
        fontWeight: "bold", 
        marginLeft: '2.5%'
    },
    imageDetailEvent: {
        width: '100%',
        height: 210,
        borderWidth: 1,
        backgroundColor: '#F8931D',
        borderRadius: 10
    },
    backgroundCard: {
        width: '100%',
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    boxContainer: {
        marginLeft: '2.5%',
        width: '95%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        // height: 120,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    button: {
        backgroundColor: '#F8931D',
        width: '90%',
        marginLeft: '5%',
        bottom: '2.5%',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    ticketCardButtonContainer: {
        // marginLeft: '5%',
        // width: '90%',
        marginTop: 10,
        borderWidth: 0.1,
        borderColor: '#e6e6e6',
        // height: 120,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        margin: '2.5%',
        backgroundColor: "#FFFFFF",
        
        shadowColor: "#5c5b5b", //#000
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 5,
    }
})

