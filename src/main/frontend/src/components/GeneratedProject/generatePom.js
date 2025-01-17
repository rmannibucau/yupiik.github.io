import { filterEnabled, isSingleModule } from "./generateFiles";
import { toPackage } from "./generationUtils";

const desindent = (lines, len) => lines.map(it => it.substring(len));

const testProperties = [
    '    <!-- Main Dependencies -->',
    '    <junit5.version>5.8.2</junit5.version>',
];
const yupiikConstantProperties = [
    '    <yupiik-batch.version>0.0.25</yupiik-batch.version>',
    '    <yupiik-logging.version>1.0.3</yupiik-logging.version>',
];
const frontendProperties = [
    '',
    '    <!-- Node/frontend related configuration -->',
    '    <node.environment>production</node.environment>',
    '    <node.version>v17.3.0</node.version>',
    '    <npm.version>8.3.0</npm.version>',
];
const simpleConfigurationDependencies = [
    '      <dependency>',
    '        <groupId>io.yupiik.batch</groupId>',
    '        <artifactId>simple-configuration</artifactId>',
    '        <version>${yupiik-batch.version}</version>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>io.yupiik.logging</groupId>',
    '            <artifactId>yupiik-logging-jul</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
];
const batchDependencies = [
    '      <dependency>',
    '        <groupId>io.yupiik.batch</groupId>',
    '        <artifactId>yupiik-batch-runtime</artifactId>',
    '        <version>${yupiik-batch.version}</version>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>io.yupiik.logging</groupId>',
    '            <artifactId>yupiik-logging-jul</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
];
const jsonRpcTransitiveProperties = [
    '    <owb.version>2.0.26</owb.version>',
    '    <johnzon.version>1.2.18</johnzon.version>',
    '    <tomcat.version>10.0.20</tomcat.version>',
    '    <xbean.version>4.21</xbean.version>',
];
const jsonrpcDocumentationDependency = [
    '      <dependency> <!-- for the doc -->',
    '        <groupId>io.yupiik.uship</groupId>',
    '        <artifactId>jsonrpc-documentation</artifactId>',
    '        <version>${yupiik-uship.version}</version>',
    '        <scope>provided</scope>',
    '      </dependency>',
];
const jsonRpcDependencies = [
    '      <dependency>',
    '        <groupId>io.yupiik.uship</groupId>',
    '        <artifactId>jsonrpc-core</artifactId>',
    '        <version>${yupiik-uship.version}</version>',
    '      </dependency>',
    '      <dependency>',
    '        <groupId>org.apache.tomcat</groupId>',
    '        <artifactId>tomcat-catalina</artifactId>',
    '        <version>${tomcat.version}</version>',
    '      </dependency>',
    '      <dependency>',
    '        <groupId>org.apache.johnzon</groupId>',
    '        <artifactId>johnzon-core</artifactId>',
    '        <version>${johnzon.version}</version>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>*</groupId>',
    '            <artifactId>*</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
    '      <dependency>',
    '        <groupId>org.apache.johnzon</groupId>',
    '        <artifactId>johnzon-mapper</artifactId>',
    '        <version>${johnzon.version}</version>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>*</groupId>',
    '            <artifactId>*</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
    '      <dependency>',
    '        <groupId>org.apache.johnzon</groupId>',
    '        <artifactId>johnzon-jsonb</artifactId>',
    '        <version>${johnzon.version}</version>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>*</groupId>',
    '            <artifactId>*</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
];
const openwebbeansTestingDependencies = [
    '      <dependency>',
    '        <groupId>org.apache.openwebbeans</groupId>',
    '        <artifactId>openwebbeans-junit5</artifactId>',
    '        <version>${owb.version}</version>',
    '        <classifier>jakarta</classifier>',
    '        <scope>test</scope>',
    '        <exclusions>',
    '          <exclusion>',
    '            <groupId>*</groupId>',
    '            <artifactId>*</artifactId>',
    '          </exclusion>',
    '        </exclusions>',
    '      </dependency>',
];
const kubernetesClientDependencies = [
    '      <dependency>',
    '        <groupId>io.yupiik.uship</groupId>',
    '        <artifactId>kubernetes-client</artifactId>',
    '        <version>${yupiik-uship.version}</version>',
    '      </dependency>',
];
const documentationProperties = [
    '    <yupiik-tools.version>1.0.24</yupiik-tools.version>',
];
const bundlebeeProperties = [
    '    <yupiik-bundlebee.version>1.0.13</yupiik-bundlebee.version>',
];
const ushipProperties = [
    '    <yupiik-uship.version>1.0.7</yupiik-uship.version>',
];
const jibProperties = [
    '',
    '    <!-- Image related configuration -->',
    '    <image.base>ossyupiik/java:17.0.1@sha256:5e8040466437f8b04e8f08a26e65b80142b130d0652fd75fe28d8a19416f36c5</image.base>',
    '    <image.workdir>/opt/applications/${project.artifactId}</image.workdir>',
    '    <image.version>${project.version}</image.version>',
    '    <image.name>${project.artifactId}/${project.artifactId}:${image.version}</image.name>',
    '    <image.registry>${project.artifactId}</image.registry>',
];
const bundlebeeJibProperties = alveolus => [
    '    <bundlebee.kube.verbose>false</bundlebee.kube.verbose>',
    '    <bundlebee.namespace>default</bundlebee.namespace>',
    '    <bundlebee.environment>default</bundlebee.environment>',
    `    <bundlebee.alveolus>${alveolus}</bundlebee.alveolus>`,
];
const bundlebeeConfiguration = [
    '        <configuration>',
    '          <manifest>${project.basedir}/src/main/bundlebee/manifest.json</manifest>',
    '          <alveolus>${bundlebee.alveolus}</alveolus>',
    '          <mavenRepositoriesDownloadsEnabled>true</mavenRepositoriesDownloadsEnabled>',
    '          <mavenRepositoriesSnapshot>https://oss.sonatype.org/content/repositories/snapshots/</mavenRepositoriesSnapshot>',
    '          <kubeVerbose>${bundlebee.kube.verbose}</kubeVerbose>',
    '          <kubeNamespace>${bundlebee.namespace}</kubeNamespace>',
    '          <skipPackaging>',
    '            <skipPackaging>none</skipPackaging>',
    '          </skipPackaging>',
    '          <customPlaceholders>',
    '            <app.deploytime>${maven.build.timestamp}</app.deploytime>',
    '            <!-- to extract the environment configuration in a file (supports maven placeholders)',
    '            <bundlebee-placeholder-import>${project.basedir}/environment/${bundlebee.environment}.properties</bundlebee-placeholder-import>',
    '            -->',
    '          </customPlaceholders>',
    '        </configuration>',
];
const loggingDependencies = [
    '    <dependency>',
    '      <groupId>io.yupiik.logging</groupId>',
    '      <artifactId>yupiik-logging-jul</artifactId>',
    '      <version>${yupiik-logging.version}</version>',
    '      <classifier>jakarta</classifier>',
    '      <scope>runtime</scope>',
    '    </dependency>'
];
const junit5Dependencies = [
    '    <dependency>',
    '      <groupId>org.junit.jupiter</groupId>',
    '      <artifactId>junit-jupiter</artifactId>',
    '      <version>${junit5.version}</version>',
    '      <scope>test</scope>',
    '    </dependency>',
];
const githubDocProfileProfile = `
<profile> <!--  mvn clean package -Pgh-pages  -->
<id>gh-pages</id>
<properties>
  <minisite.serverId>github.com</minisite.serverId>
</properties>
<build>
  <plugins>
    <plugin>
      <groupId>io.yupiik.maven</groupId>
      <artifactId>yupiik-tools-maven-plugin</artifactId>
      <executions>
        <execution>
          <id>gh-pages</id>
          <phase>prepare-package</phase>
          <goals>
            <goal>minisite</goal>
          </goals>
          <configuration>
            <git>
              <ignore>false</ignore>
              <noJekyll>true</noJekyll>
              <serverId>\${minisite.serverId}</serverId>
              <branch>refs/heads/gh-pages</branch>
              <url>\${project.scm.url}</url>
            </git>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
</profile>`.trim().split('\n');
const jibPiProfile = [
    '    <profile>',
    '      <!-- Represents a different docker registry environment (here a Raspberry PI) -->',
    '      <id>pi</id>',
    '      <properties>',
    '        <maven.build.timestamp.format>yyyyMMddHHmmss</maven.build.timestamp.format>',
    '        <jib.allowInsecureRegistries>true</jib.allowInsecureRegistries>',
    '        <pi.base>pi:32000/${project.artifactId}</pi.base>',
    '        <image.base>arm64v8/openjdk:17.0.1-slim-buster@sha256:9f4f3ad2b51467ec9dbb8b780cc82734b02f42a535ccf5f58492eec497f7cf4a</image.base>',
    '        <image.registry>${pi.base}/</image.registry>',
    '        <image.name>${image.registry}${project.artifactId}:${image.version}</image.name>',
    '      </properties>',
    '      <build>',
    '        <plugins>',
    '          <plugin>',
    '            <groupId>com.google.cloud.tools</groupId>',
    '            <artifactId>jib-maven-plugin</artifactId>',
    '            <configuration>',
    '              <from>',
    '                <image>${image.base}</image>',
    '                <platforms>',
    '                  <platform>',
    '                    <os>linux</os>',
    '                    <architecture>arm64</architecture>',
    '                  </platform>',
    '                </platforms>',
    '              </from>',
    '            </configuration>',
    '          </plugin>',
    '        </plugins>',
    '      </build>',
    '    </profile>',
];
const gitPlugin = [
    '      <!-- ENABLE WHEN PUSHED ON GIT',
    '      <plugin>',
    '        <groupId>pl.project13.maven</groupId>',
    '        <artifactId>git-commit-id-plugin</artifactId>',
    '        <version>4.9.10</version>',
    '        <executions>',
    '          <execution>',
    '            <id>get-the-git-infos</id>',
    '            <phase>initialize</phase>',
    '            <goals>',
    '              <goal>revision</goal>',
    '            </goals>',
    '          </execution>',
    '        </executions>',
    '        <configuration>',
    '          <injectAllReactorProjects>true</injectAllReactorProjects>',
    '          <generateGitPropertiesFile>false</generateGitPropertiesFile>',
    '          <dateFormat>yyyy-MM-dd\'T\'HH:mm:ss\'Z\'</dateFormat>',
    '          <dateFormatTimeZone>GMT</dateFormatTimeZone>',
    '          <includeOnlyProperties>',
    '            <includeOnlyProperty>^git.branch$</includeOnlyProperty>',
    '            <includeOnlyProperty>^git.remote.origin.url$</includeOnlyProperty>',
    '            <includeOnlyProperty>^git.commit.id$</includeOnlyProperty>',
    '            <includeOnlyProperty>^git.commit.time$</includeOnlyProperty>',
    '          </includeOnlyProperties>',
    '        </configuration>',
    '      </plugin>',
    '      -->',
];
const resourcesPlugin = [
    '      <plugin>',
    '        <groupId>org.apache.maven.plugins</groupId>',
    '        <artifactId>maven-resources-plugin</artifactId>',
    '        <version>3.2.0</version>',
    '        <configuration>',
    '          <encoding>UTF-8</encoding>',
    '        </configuration>',
    '      </plugin>',
];
const compilerPlugin = data => [
    '      <plugin>',
    '        <groupId>org.apache.maven.plugins</groupId>',
    '        <artifactId>maven-compiler-plugin</artifactId>',
    '        <version>3.8.1</version>',
    '        <configuration>',
    `          <source>${data.nav.javaVersion}</source>`,
    `          <target>${data.nav.javaVersion}</target>`,
    `          <release>${data.nav.javaVersion}</release>`,
    '          <encoding>UTF-8</encoding>',
    `          <compilerArgs>`,
    `            <compilerArg>-parameters</compilerArg>`,
    `          </compilerArgs>`,
    '        </configuration>',
    '      </plugin>'
];
const ossIndexPlugin = [
    '      <plugin> <!--  mvn ossindex:audit -->',
    '        <groupId>org.sonatype.ossindex.maven</groupId>',
    '        <artifactId>ossindex-maven-plugin</artifactId>',
    '        <version>3.1.0</version>',
    '        <configuration>',
    '          <scope>compile,runtime</scope>',
    '        </configuration>',
    '      </plugin>',
];
const jibPlugin = (singleModule, frontend, jsonRpc, batchClass) => [
    '      <plugin>',
    '        <groupId>com.google.cloud.tools</groupId>',
    '        <artifactId>jib-maven-plugin</artifactId>',
    '        <version>3.1.4</version>',
    '        <!--',
    '        mvn package jib:build [-Dimage.registry=...] -> will be pushed',
    '        mvn package -Pdocker -> local docker image',
    '        -->',
    '        <configuration>',
    '          <containerizingMode>packaged</containerizingMode>',
    '          <from>',
    '            <image>${image.base}</image>',
    '          </from>',
    '          <to>',
    '            <image>${image.name}</image>',
    '          </to>',
    ...(singleModule && frontend ? [
        '          <extraDirectories>',
        '            <paths combine.children="append">',
        '              <path>',
        '                <from>${project.build.outputDirectory}/META-INF/resources</from>',
        '                <into>${image.workdir}/docs</into>',
        '              </path>',
        '            </paths>',
        '          </extraDirectories>',
    ] : []),
    '          <container>',
    `            <mainClass>${jsonRpc ? 'org.apache.openwebbeans.se.CDILauncher' : (batchClass || 'OVERRIDEN_IN_CHILD')}</mainClass>`,
    ...(jsonRpc || frontend ? [
        '            <args>',
        '              <arg>--openwebbeans.main</arg>',
        '              <arg>uShipTomcatAwait</arg>',
        '            </args>',
    ] : []),
    '            <appRoot>${image.workdir}</appRoot>',
    '            <workingDirectory>${image.workdir}</workingDirectory>',
    '            <extraClasspath>${image.workdir}/custom/*:${image.workdir}/custom</extraClasspath>',
    '            <creationTime>USE_CURRENT_TIMESTAMP</creationTime>',
    '            <jvmFlags>',
    '              <jvmFlag>-Djava.util.logging.manager=io.yupiik.logging.jul.YupiikLogManager</jvmFlag>',
    '              <jvmFlag>-Dio.yupiik.logging.jul.handler.StandardHandler.formatter=json</jvmFlag>',
    '              <jvmFlag>-Djava.security.egd=file:/dev/./urandom</jvmFlag>',
    '              <jvmFlag>-Djdk.serialFilter=!*</jvmFlag>',
    '              <jvmFlag>-Djdk.jndi.object.factoriesFilter=!*</jvmFlag>',
    '              <jvmFlag>-Dcom.sun.jndi.ldap.object.trustSerialData=false</jvmFlag>',
    '            </jvmFlags>',
    '            <labels>',
    '              <!-- ENABLE WHEN PUSHED ON GIT if you want these info in the attributes',
    '              <org.opencontainers.image.revision>${git.commit.id}</org.opencontainers.image.revision>',
    '              <org.opencontainers.image.ref.name>${git.branch}</org.opencontainers.image.ref.name>',
    '              <org.opencontainers.image.source>${git.remote.origin.url}</org.opencontainers.image.source>',
    '              <org.opencontainers.image.url>${project.scm.url}</org.opencontainers.image.url>',
    '              <org.opencontainers.image.documentation>\${project.parent.parent.scm.url}</org.opencontainers.image.documentation>',
    '              -->',
    '              <org.opencontainers.image.created>${maven.build.timestamp}</org.opencontainers.image.created>',
    '              <org.opencontainers.image.authors>${project.artifactId}</org.opencontainers.image.authors>',
    '              <org.opencontainers.image.vendor>${project.artifactId}</org.opencontainers.image.vendor>',
    '              <org.opencontainers.image.title>${project.artifactId}</org.opencontainers.image.title>',
    '              <org.opencontainers.image.description>${project.description}</org.opencontainers.image.description>',
    '              <org.opencontainers.image.version>${project.version}</org.opencontainers.image.version>',
    '              <com.application.params>_JAVA_OPTIONS=...</com.application.params>',
    '              <com.application.cmd>docker run ${image.name} &lt;args&gt;</com.application.cmd>',
    '            </labels>',
    '          </container>',
    '          <outputPaths>',
    '            <imageJson>${project.build.directory}/jib-image.json</imageJson>',
    '          </outputPaths>',
    '        </configuration>',
    '      </plugin>',
];
const minisiteConfiguration = pck => [
    '        <configuration>',
    '          <siteBase>https://${project.groupId}.github.io/${project.artifactId}</siteBase>',
    '          <logoText>${project.artifactId}</logoText>',
    '          <indexText>${project.artifactId}</indexText>',
    '          <copyright>${project.artifactId}</copyright>',
    '          <linkedInCompany>${project.artifactId}</linkedInCompany>',
    '          <indexSubTitle>${project.description}</indexSubTitle>',
    '          <injectYupiikTemplateExtensionPoints>false</injectYupiikTemplateExtensionPoints>',
    '          <preActions>',
    '            <preAction>',
    `              <type>${pck}.build.ConfigurationGenerator</type>`,
    '            </preAction>',
    '          </preActions>',
    '          <customScripts>',
    '          <![CDATA[[',
    '          <script>',
    '          $(document).ready(function(){',
    '            function filterTables() {',
    '              $(\'input[table-filter]\').on(\'keyup\', function () {',
    '                var input = $(this);',
    '                var value = input.val().toLowerCase();',
    '                $(\'table.\' + input.attr(\'table-filter\') + \' tr\').filter(function () {',
    '                  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);',
    '                });',
    '              });',
    '            }',
    '',
    '            filterTables();',
    '          });',
    '          </script>',
    '          ]]>',
    '          </customScripts>',
    '          <attributes>',
    '            <partialsdir>${project.basedir}/src/main/minisite/content/_partials</partialsdir>',
    '            <!-- ENABLE WHEN PUSHED ON GIT if you want these info in the attributes',
    '            <gitCommitId>${git.commit.id}</gitCommitId>',
    '            <gitBranch>${git.branch}</gitBranch>',
    '            <gitTime>${git.commit.time}</gitTime>',
    '            -->',
    '          </attributes>',
    '        </configuration>',
];
const frontendConfiguration = singleModule => ([
    '        <executions>',
    '          <execution>',
    '            <id>install-node-npm</id>',
    '            <phase>generate-resources</phase>',
    '            <goals>',
    '              <goal>install-node-and-npm</goal>',
    '            </goals>',
    '            <configuration>',
    `              <installDirectory>\${project.basedir}/${singleModule ? 'src/main/frontend/' : ''}.node</installDirectory>`,
    '              <nodeVersion>${node.version}</nodeVersion>',
    '              <npmVersion>${npm.version}</npmVersion>',
    '            </configuration>',
    '          </execution>',
    '          <execution>',
    '            <id>npm-install</id>',
    '            <phase>process-classes</phase>',
    '            <goals>',
    '              <goal>npm</goal>',
    '            </goals>',
    '          </execution>',
    '          <execution>',
    '            <id>npm-build</id>',
    '            <phase>process-classes</phase>',
    '            <goals>',
    '              <goal>npm</goal>',
    '            </goals>',
    '            <configuration>',
    '              <arguments>run build</arguments>',
    '              <environmentVariables>',
    '                <PROJECT_VERSION>${project.version}</PROJECT_VERSION>',
    '                <BUILD_DATE>${maven.build.timestamp}</BUILD_DATE>',
    '                <NODE_ENV>${node.environment}</NODE_ENV>',
    '              </environmentVariables>',
    '            </configuration>',
    '          </execution>',
    '        </executions>',
    '        <configuration>',
    `          <installDirectory>\${project.basedir}/${singleModule ? 'src/main/frontend/' : ''}.node</installDirectory>`,
    `          <workingDirectory>\${project.basedir}${singleModule ? '/src/main/frontend/' : ''}</workingDirectory>`,
    '        </configuration>',
]);
const jarPlugin = [
    '      <plugin>',
    '        <groupId>org.apache.maven.plugins</groupId>',
    '        <artifactId>maven-jar-plugin</artifactId>',
    '        <version>3.2.2</version>',
    '        <configuration>',
    '          <excludes>',
    '            <exclude>**/.keepit</exclude>',
    '            <exclude>**/build/**</exclude>',
    '          </excludes>',
    '          <archive combine.children="append">',
    '            <manifestEntries>',
    '              <App-Build-Timestamp>${maven.build.timestamp}</App-Build-Timestamp>',
    '            </manifestEntries>',
    '          </archive>',
    '        </configuration>',
    '      </plugin>'
];
const releasePlugin = [
    '      <plugin>',
    '        <groupId>org.apache.maven.plugins</groupId>',
    '        <artifactId>maven-release-plugin</artifactId>',
    '        <version>3.0.0-M1</version>',
    '        <configuration>',
    '          <releaseProfiles>release</releaseProfiles>',
    '          <autoVersionSubmodules>true</autoVersionSubmodules>',
    '        </configuration>',
    '      </plugin>'
];
const surefirePlugin = [
    '      <plugin>',
    '        <groupId>org.apache.maven.plugins</groupId>',
    '        <artifactId>maven-surefire-plugin</artifactId>',
    '        <version>3.0.0-M5</version>',
    '        <configuration>',
    '          <trimStackTrace>false</trimStackTrace>',
    '          <statelessTestsetInfoReporter implementation="org.apache.maven.plugin.surefire.extensions.junit5.JUnit5StatelessTestsetInfoTreeReporter"/>',
    '          <systemPropertyVariables>',
    '            <java.net.preferIPv4Stack>true</java.net.preferIPv4Stack>',
    '            <java.util.logging.manager>io.yupiik.logging.jul.YupiikLogManager</java.util.logging.manager>',
    '          </systemPropertyVariables>',
    '        </configuration>',
    '        <dependencies>',
    '          <dependency>',
    '            <groupId>me.fabriciorby</groupId>',
    '            <artifactId>maven-surefire-junit5-tree-reporter</artifactId>',
    '            <version>0.1.0</version>',
    '          </dependency>',
    '        </dependencies>',
    '      </plugin>'
];

const scm = data => [
    '  <!-- ENABLE WHEN PUSHED ON GIT',
    '  <scm>',
    '    <tag>HEAD</tag>',
    `    <url>https://github.com/${data.nav.artifactId}/${data.nav.artifactId}.git</url>`,
    `    <developerConnection>scm:git:git@github.com:${data.nav.artifactId}/${data.nav.artifactId}.git</developerConnection>`,
    `    <connection>scm:git:git@github.com:${data.nav.artifactId}/${data.nav.artifactId}.git</connection>`,
    '  </scm>',
    '  -->',
];

export const generatePom = data => {
    const enabledFeatures = filterEnabled(data.features);
    const singleModule = isSingleModule(enabledFeatures);
    const frontend = enabledFeatures.filter(it => it.key == 'frontend').length == 1;
    const needsProfiles = data.features.jib.enabled || (data.features.github.enabled && data.features.documentation.enabled);

    const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<project xmlns="http://maven.apache.org/POM/4.0.0"',
        '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">',
        '',
        '  <modelVersion>4.0.0</modelVersion>',
        '',
        `  <groupId>${data.nav.groupId}</groupId>`,
        `  <artifactId>${data.nav.artifactId}${singleModule ? '' : '-parent'}</artifactId>`,
        `  <version>${data.nav.version}</version>`,
        ...(singleModule ? [] : ['  <packaging>pom</packaging>']),
        `  <name>${data.nav.artifactId}</name>`,
        `  <description>${data.nav.artifactId}</description>`,
        '',
        '  <properties>',
        ...testProperties,
        ...(!data.features.jsonRpc.enabled ? [] : jsonRpcTransitiveProperties),
        ...(!data.features.jsonRpc.enabled && !data.features.kubernetesClient.enabled ? [] : ushipProperties),
        ...(!data.features.documentation.enabled ? [] : documentationProperties),
        ...(!data.features.bundlebee.enabled ? [] : bundlebeeProperties),
        // used for the configuration anyway so import it without a condition on the feature
        ...yupiikConstantProperties,
        ...(!data.features.frontend.enabled ? [] : frontendProperties),
        ...(!data.features.jib.enabled ? [] : jibProperties),
        ...(!data.features.jib.enabled || !data.features.bundlebee.enabled ? [] : bundlebeeJibProperties(data.nav.artifactId)),
        '  </properties>',
        '',
        ...(singleModule ? [] : [
            '  <modules>',
            ...(!data.features.batch.enabled ? [] : [
                `    <module>${data.nav.artifactId}-batch${data.features.batch.useParent ? '-parent' : ''}</module>`,
            ]),
            ...(!data.features.jsonRpc.enabled ? [] : [
                `    <module>${data.nav.artifactId}-jsonrpc${data.features.jsonRpc.useParent ? '-parent' : ''}</module>`,
            ]),
            ...(!data.features.frontend.enabled ? [] : [
                `    <module>${data.nav.artifactId}-frontend${data.features.frontend.useParent ? '-parent' : ''}</module>`,
            ]),
            ...(!data.features.bundlebee.enabled ? [] : [
                `    <module>${data.nav.artifactId}-bundlebee</module>`,
            ]),
            ...(!data.features.documentation.enabled ? [] : [
                `    <module>${data.nav.artifactId}-documentation</module>`,
            ]),
            '  </modules>',
            '',
        ]),
        ...(needsProfiles ? ['  <profiles>' ] : []),
        ...(!data.features.documentation.enabled || !data.features.github.enabled ? [] : githubDocProfileProfile),
        ...(!data.features.jib.enabled ? [] : jibPiProfile),
        ...(needsProfiles ? ['  </profiles>' ] : []),
        ...(singleModule ? [] : [
            '  <dependencyManagement>',
            '    <dependencies>',
            // no dependency for data.features.documentation and data.features.jib themselves
            ...(data.features.jsonRpc.enabled && data.features.documentation.enabled ? jsonrpcDocumentationDependency : []),
            ...(!data.features.jsonRpc.enabled ? [] : jsonRpcDependencies),
            ...simpleConfigurationDependencies,
            ...(!data.features.batch.enabled ? [] : batchDependencies),
            ...(!data.features.kubernetesClient.enabled ? [] : kubernetesClientDependencies),
            '',
            '    <!-- Test dependencies -->',
            ...(!data.features.jsonRpc.enabled ? [] : openwebbeansTestingDependencies),
            '    </dependencies>',
            '  </dependencyManagement>',
            '',
        ]),
        '  <dependencies>',
        ...loggingDependencies,
        ...(!singleModule ? [] : [
            ...(data.features.jsonRpc.enabled && data.features.documentation.enabled ? desindent(jsonrpcDocumentationDependency, 2) : []),
            ...(!data.features.jsonRpc.enabled ? [] : desindent(jsonRpcDependencies, 2)),
            ...desindent(simpleConfigurationDependencies, 2),
            ...(!data.features.batch.enabled ? [] : desindent(batchDependencies, 2)),
            ...(!data.features.kubernetesClient.enabled ? [] : desindent(kubernetesClientDependencies, 2)),
        ]),
        '',
        '    <!-- Test dependencies -->',
        ...junit5Dependencies,
        ...(!singleModule ? [] : [
            ...(!data.features.jsonRpc.enabled ? [] : desindent(openwebbeansTestingDependencies, 2)),
        ]),
        '  </dependencies>',
        '',
        ...scm(data),
        '',
        '  <build>',
        '    <plugins>',
        ...gitPlugin,
        ...(!data.features.documentation.enabled ? [] : [
            '      <plugin> <!-- mvn [compile] yupiik-tools:serve-minisite -e -->',
            '        <groupId>io.yupiik.maven</groupId>',
            '        <artifactId>yupiik-tools-maven-plugin</artifactId>',
            '        <version>${yupiik-tools.version}</version>',
            ...(!singleModule ? [] : minisiteConfiguration(toPackage(data.nav.groupId, data.nav.artifactId))),
            '      </plugin>',
        ]),
        ...(!data.features.bundlebee.enabled ? [] : [
            '      <plugin> <!-- mvn bundlebee:apply [-D....] -->',
            '        <groupId>io.yupiik</groupId>',
            '        <artifactId>bundlebee-maven-plugin</artifactId>',
            '        <version>${yupiik-bundlebee.version}</version>',
            ...(!singleModule ? [] : bundlebeeConfiguration),
            '      </plugin>',
        ]),
        ...(!data.features.frontend.enabled ? [] : [
            '      <plugin>',
            '        <groupId>com.github.eirslett</groupId>',
            '        <artifactId>frontend-maven-plugin</artifactId>',
            '        <version>1.12.0</version>',
            ...(!singleModule ? [] : frontendConfiguration(singleModule)),
            '      </plugin>',
        ]),
        ...(!data.features.jib.enabled ? [] : jibPlugin(
            singleModule, frontend,
            data.features.jsonRpc.enabled,
            data.features.batch.enabled && !data.features.jsonRpc.enabled ?
                `${toPackage(data.nav.groupId, data.nav.artifactId)}.batch.SimpleBatch` :
                undefined)),
        ...resourcesPlugin,
        ...compilerPlugin(data),
        ...surefirePlugin,
        ...jarPlugin,
        ...releasePlugin,
        ...ossIndexPlugin,
        '    </plugins>',
        '  </build>',
        '</project>',
        ''
    ];
    return lines.join('\n');
};
