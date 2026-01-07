import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';

interface LocationData {
    name: string;
    country: string;
}

interface WeatherHeaderProps {
    showSearch: boolean;
    toggleSearch: (value: boolean) => void;
    locations: LocationData[];
    handleTextDebounce: (text: string) => void;
    handleLocation: (loc: LocationData) => void;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
    showSearch,
    toggleSearch,
    locations,
    handleTextDebounce,
    handleLocation
}) => {
    return (
        <View style={[styles.searchSectionWrapper, { height: '7%' }]}>
            <View style={[
                styles.searchBar,
                { backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.3)' : 'transparent' }
            ]}>
                {showSearch ? (
                    <TextInput
                        onChangeText={handleTextDebounce}
                        placeholder="Search city"
                        placeholderTextColor={'lightgray'}
                        style={styles.searchInput}
                    />
                ) : null}
                <TouchableOpacity
                    onPress={() => toggleSearch(!showSearch)}
                    style={[styles.searchButton, { backgroundColor: showSearch ? 'transparent' : 'rgba(255, 255, 255, 0.3)' }]}
                >
                    <MagnifyingGlassIcon size={25} color="white" />
                </TouchableOpacity>
            </View>

            {/* Dropdown gợi ý địa điểm */}
            {locations?.length > 0 && showSearch ? (
                <View style={styles.locationList}>
                    {locations.map((loc, index) => {
                        let showBorder = index + 1 !== locations.length;
                        return (
                            <TouchableOpacity
                                onPress={() => handleLocation(loc)}
                                key={index}
                                style={[styles.locationItem, showBorder ? styles.locationItemBorder : null]}
                            >
                                <MapPinIcon size={20} color="gray" />
                                <Text style={styles.locationText}>{loc?.name}, {loc?.country}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    searchSectionWrapper: {
        marginHorizontal: 16,
        position: 'relative',
        zIndex: 50,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 30,
        overflow: 'hidden',
    },
    searchInput: {
        paddingLeft: 24,
        paddingBottom: 4,
        flex: 1,
        fontSize: 16,
        color: 'white',
        backgroundColor: 'transparent',
    },
    searchButton: {
        padding: 12,
        borderRadius: 9999,
        margin: 4,
    },
    locationList: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgb(209 213 219)',
        top: 64,
        borderRadius: 24,
        zIndex: 60,
        elevation: 5,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    locationItemBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(156 163 175)',
    },
    locationText: {
        color: 'black',
        fontSize: 18,
        marginLeft: 8,
    },
});

export default WeatherHeader;