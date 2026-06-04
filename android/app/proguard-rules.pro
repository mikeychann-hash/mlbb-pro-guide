# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# --- Capacitor / WebView bridge keep rules (added for R8/minify) ---
-keep public class * extends com.getcapacitor.Plugin
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * { *; }
-keepclassmembers class * { @com.getcapacitor.annotation.* <methods>; }
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keepattributes *Annotation*, JavascriptInterface
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.**
