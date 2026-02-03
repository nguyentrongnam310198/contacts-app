import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../theme/themeContext';

interface WeatherFooterProps {
    forecast: any;
}

const WeatherFooter: React.FC<WeatherFooterProps> = ({ forecast }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.forecastSection}>
            <View style={styles.forecastHeader}>
                <CalendarDaysIcon size={22} color={colors.buttonText} />
                <Text style={[styles.forecastHeaderText, { color: colors.text }]}>Daily forecast</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {forecast?.forecastday?.map((item: any, index: number) => {
                    let date = new Date(item.date);
                    let options: Intl.DateTimeFormatOptions = { weekday: 'long' };
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0];

                    return (
                        <View
                            key={index}
                            style={[styles.forecastCard, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}
                        >
                            <Image
                                source={{ uri: 'https:' + item?.day?.condition?.icon }}
                                style={styles.forecastIcon}
                            />
                            <Text style={[styles.forecastDay, { color: colors.text }]}>{dayName}</Text>
                            <Text style={[styles.forecastTemp, { color: colors.text }]}>{item?.day?.avgtemp_c}&#176;</Text>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    forecastSection: {
        marginBottom: 8,
        gap: 12,
    },
    forecastHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        gap: 8,
    },
    forecastHeaderText: {
        color: 'white',
        fontSize: 16,
    },
    forecastCard: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        borderRadius: 24,
        paddingVertical: 12,
        marginRight: 16,
        gap: 4,
    },
    forecastIcon: {
        width: 44,
        height: 44,
    },
    forecastDay: {
        color: 'white',
    },
    forecastTemp: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    }
});

export default WeatherFooter;