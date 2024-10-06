package com.naveanalytics;

import lombok.extern.log4j.Log4j2;

import java.util.HashMap;
import java.util.Map;

@Log4j2
public class Translator {

    private static final Map<String, String> translationsEnglish = new HashMap<>() {{
        put("Name", "Name");
        put("Area", "Area");
        put("Crop", "Crop");
        put("Planted At", "Planted At");
        put("Agronomist", "User");
        put("Organization name", "Organization name");
        put("Crop Water Use", "Crop Water Use");
        put("Soil water content", "Soil water content");
        put("Risk of nutrients loss", "Risk of nutrients loss");
        put("Risk of water shortage", "Risk of water shortage");
        put("Expected rain", "Expected rain");
        put("Crop Water Use Forecast", "Crop Water Use Forecast");
        put("Soil water content Forecast", "Soil water content Forecast");
        put("Risk of nutrients loss Forecast", "Risk of nutrients loss Forecast");
        put("Risk of water shortage Forecast", "Risk of water shortage Forecast");
        put("mm", "mm");
        put("in", "in");
        put("%", "%");
    }};
    private static final Map<String, String> translationsSpanish = new HashMap<>() {{
        put("Name", "Nombre");
        put("Area", "Área");
        put("Crop", "Cultivo");
        put("Planted At", "Plantado en");
        put("Agronomist", "Usuario");
        put("Organization name", "Nombre de la organización");
        put("Crop Water Use", "Uso de agua de cultivo");
        put("Soil water content", "Contenido de agua del suelo");
        put("Risk of nutrients loss", "Riesgo de pérdida de nutrientes");
        put("Risk of water shortage", "Riesgo de escasez de agua");
        put("Expected rain", "Lluvia esperada");
        put("Crop Water Use Forecast", "Pronóstico de uso de agua de cultivo");
        put("Soil water content Forecast", "Pronóstico de contenido de agua del suelo");
        put("Risk of nutrients loss Forecast", "Pronóstico de riesgo de pérdida de nutrientes");
        put("Risk of water shortage Forecast", "Pronóstico de riesgo de escasez de agua");
        put("mm", "mm");
        put("in", "in");
        put("%", "%");
    }};
    private static final Map<String, String> translationsPortuguese = new HashMap<>() {{
        put("Name", "Nome");
        put("Area", "Área");
        put("Crop", "Cultura");
        put("Planted At", "Plantado em");
        put("Agronomist", "Usuário");
        put("Organization name", "Nome da organização");
        put("Crop Water Use", "Uso de água da cultura");
        put("Soil water content", "Conteúdo de água do solo");
        put("Risk of nutrients loss", "Risco de perda de nutrientes");
        put("Risk of water shortage", "Risco de escassez de água");
        put("Expected rain", "Chuva esperada");
        put("Crop Water Use Forecast", "Previsão de uso de água da cultura");
        put("Soil water content Forecast", "Previsão de conteúdo de água do solo");
        put("Risk of nutrients loss Forecast", "Previsão de risco de perda de nutrientes");
        put("Risk of water shortage Forecast", "Previsão de risco de escassez de água");
        put("mm", "mm");
        put("in", "in");
        put("%", "%");
    }};

    public static String translate(String input, String locale) {
        var value = switch (resolveLanguages(locale)) {
            case "es" -> translationsSpanish.get(input);
            case "pt" -> translationsPortuguese.get(input);
            default -> translationsEnglish.get(input);
        };
        if (value == null) {
            log.error("Translation not found for input: " + input + " and locale: " + locale);
        }
        return value;
    }


    private static String resolveLanguages(String locale) {
        if (locale == null ||locale.startsWith("en")) {
            return "en";
        } else if (locale.startsWith("es")) {
            return "es";
        } else if (locale.startsWith("pt")) {
            return "pt";
        } else {
            return "en";
        }
    }
    
}
