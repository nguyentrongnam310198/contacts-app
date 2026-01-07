import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { weatherImages } from '../../utils/constants/constants';

interface WeatherBodyProps {
    current: any;
    location: any;
    forecast: any;
}

const WeatherBody: React.FC<WeatherBodyProps> = ({ current, location, forecast }) => {
    return (
        <View style={styles.infoSection}>
            <Text style={styles.cityName}>
                {location?.name},
                <Text style={styles.countryName}>
                    {" " + location?.country}
                </Text>
            </Text>

            <View style={styles.weatherImageContainer}>
                <Image
                    source={
                        (current?.condition?.text && weatherImages[current.condition.text])
                            ? weatherImages[current.condition.text]
                            : { uri: 'https:' + current?.condition?.icon }
                    }
                    style={styles.weatherImage}
                />
            </View>

            <View style={styles.temperatureContainer}>
                <Text style={styles.temperatureText}>
                    {current?.temp_c}°C
                </Text>
                <Text style={styles.weatherStatusText}>
                    {current?.condition?.text}
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Image source={require('../../assets/icons/wind.png')} style={styles.statIcon} />
                    <Text style={styles.statText}>{current?.wind_kph}km</Text>
                </View>
                <View style={styles.statItem}>
                    <Image source={require('../../assets/icons/drop.png')} style={styles.statIcon} />
                    <Text style={styles.statText}>{current?.humidity}%</Text>
                </View>
                <View style={styles.statItem}>
                    <Image source={require('../../assets/icons/sun.png')} style={styles.statIcon} />
                    <Text style={styles.statText}>
                        {forecast?.forecastday?.[0]?.astro?.sunrise}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoSection: {
        marginHorizontal: 16,
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    cityName: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    countryName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgb(209 213 219)',
    },
    weatherImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    weatherImage: {
        width: 208,
        height: 208,
    },
    temperatureContainer: {
        alignItems: 'center',
        gap: 8,
    },
    temperatureText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 60,
        marginLeft: 20,
    },
    weatherStatusText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        letterSpacing: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statIcon: {
        width: 24,
        height: 24,
    },
    statText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default WeatherBody;