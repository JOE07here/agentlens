/**
 * Bundled sample exports for the in-browser demo. GENERATED from the canonical
 * files in /samples by scripts/gen-samples.mjs — do not edit by hand; edit the
 * sample files and re-run `node scripts/gen-samples.mjs`.
 */
export const sampleMidpointXml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Sample MidPoint user export (simplified, namespace-default).
  Mix of human and non-human identities. svc-payment-bot and svc-data-sync
  also exist as Keycloak clients (see keycloak-realm.json) so the correlator
  has something to link. Dates are relative to a "today" of 2026-06-22.
-->
<objects xmlns="http://midpoint.evolveum.com/xml/ns/public/common/common-3">

  <user oid="u-1001">
    <name>svc-payment-bot</name>
    <fullName>Payment Processing Service</fullName>
    <emailAddress>payments-ops@example.com</emailAddress>
    <ownerRef oid="org-finance" type="OrgType">finance-team</ownerRef>
    <activation>
      <administrativeStatus>enabled</administrativeStatus>
    </activation>
    <lastLoginTimestamp>2026-06-20T11:02:00Z</lastLoginTimestamp>
    <metadata>
      <createTimestamp>2023-01-15T08:00:00Z</createTimestamp>
    </metadata>
    <assignment>
      <targetRef oid="role-admin" type="RoleType">admin</targetRef>
    </assignment>
    <assignment>
      <targetRef oid="role-pay-init" type="RoleType">payment-initiator</targetRef>
    </assignment>
    <assignment>
      <targetRef oid="role-pay-appr" type="RoleType">payment-approver</targetRef>
    </assignment>
    <credentials>
      <password>
        <metadata>
          <createTimestamp>2023-01-15T08:00:00Z</createTimestamp>
        </metadata>
      </password>
    </credentials>
  </user>

  <user oid="u-1002">
    <name>svc-data-sync</name>
    <fullName>Nightly Data Sync</fullName>
    <emailAddress>data-platform@example.com</emailAddress>
    <ownerRef oid="org-data" type="OrgType">data-platform</ownerRef>
    <activation>
      <administrativeStatus>enabled</administrativeStatus>
    </activation>
    <lastLoginTimestamp>2025-11-20T02:15:00Z</lastLoginTimestamp>
    <metadata>
      <createTimestamp>2024-03-01T09:00:00Z</createTimestamp>
    </metadata>
    <assignment>
      <targetRef oid="role-data-reader" type="RoleType">data-reader</targetRef>
    </assignment>
    <credentials>
      <password>
        <metadata>
          <createTimestamp>2025-05-01T09:00:00Z</createTimestamp>
        </metadata>
      </password>
    </credentials>
  </user>

  <user oid="u-1003">
    <name>alice.chen</name>
    <fullName>Alice Chen</fullName>
    <emailAddress>alice.chen@example.com</emailAddress>
    <activation>
      <administrativeStatus>enabled</administrativeStatus>
    </activation>
    <lastLoginTimestamp>2026-06-21T16:40:00Z</lastLoginTimestamp>
    <metadata>
      <createTimestamp>2022-06-01T08:00:00Z</createTimestamp>
    </metadata>
    <assignment>
      <targetRef oid="role-data-reader" type="RoleType">data-reader</targetRef>
    </assignment>
    <assignment>
      <targetRef oid="role-report-viewer" type="RoleType">report-viewer</targetRef>
    </assignment>
  </user>

  <user oid="u-1004">
    <name>bob.admin</name>
    <fullName>Bob Okafor</fullName>
    <emailAddress>bob.okafor@example.com</emailAddress>
    <activation>
      <administrativeStatus>enabled</administrativeStatus>
    </activation>
    <lastLoginTimestamp>2026-06-22T07:30:00Z</lastLoginTimestamp>
    <metadata>
      <createTimestamp>2021-09-10T08:00:00Z</createTimestamp>
    </metadata>
    <assignment>
      <targetRef oid="role-admin" type="RoleType">admin</targetRef>
    </assignment>
  </user>

  <user oid="u-1005">
    <name>svc-report-gen</name>
    <fullName>Report Generation Service</fullName>
    <emailAddress>reporting@example.com</emailAddress>
    <ownerRef oid="org-data" type="OrgType">data-platform</ownerRef>
    <activation>
      <administrativeStatus>enabled</administrativeStatus>
    </activation>
    <lastLoginTimestamp>2026-06-21T23:00:00Z</lastLoginTimestamp>
    <metadata>
      <createTimestamp>2026-04-01T09:00:00Z</createTimestamp>
    </metadata>
    <assignment>
      <targetRef oid="role-report-viewer" type="RoleType">report-viewer</targetRef>
    </assignment>
    <credentials>
      <password>
        <metadata>
          <createTimestamp>2026-05-01T09:00:00Z</createTimestamp>
        </metadata>
      </password>
    </credentials>
  </user>

</objects>
`;

export const sampleKeycloakJson = `{
  "realm": "example",
  "enabled": true,
  "_comment": "Sample Keycloak realm export. svc-payment-bot and svc-data-sync mirror MidPoint identities; legacy-integration is Keycloak-only. 'account' and 'admin-cli' are system clients the adapter must skip. Secret times are epoch seconds in client attributes; expiration '0' means never.",
  "roles": {
    "realm": [
      { "name": "user", "description": "Standard application user" },
      { "name": "view-events", "description": "Read audit events" }
    ],
    "client": {
      "realm-management": [
        { "name": "realm-admin", "description": "Full realm administration" },
        { "name": "view-users", "description": "Read users" }
      ]
    }
  },
  "users": [
    {
      "id": "kc-u-1",
      "username": "alice.chen",
      "enabled": true,
      "email": "alice.chen@example.com",
      "firstName": "Alice",
      "lastName": "Chen",
      "createdTimestamp": 1654070400000,
      "realmRoles": ["offline_access", "uma_authorization", "user"],
      "clientRoles": {}
    },
    {
      "id": "kc-sa-1",
      "username": "service-account-svc-payment-bot",
      "enabled": true,
      "serviceAccountClientId": "svc-payment-bot",
      "createdTimestamp": 1673769600000,
      "realmRoles": ["default-roles-example"],
      "clientRoles": {
        "realm-management": ["realm-admin"]
      }
    },
    {
      "id": "kc-sa-2",
      "username": "service-account-svc-data-sync",
      "enabled": true,
      "serviceAccountClientId": "svc-data-sync",
      "createdTimestamp": 1746090000000,
      "realmRoles": ["view-events"],
      "clientRoles": {}
    },
    {
      "id": "kc-sa-3",
      "username": "service-account-legacy-integration",
      "enabled": true,
      "serviceAccountClientId": "legacy-integration",
      "createdTimestamp": 1704067200000,
      "realmRoles": [],
      "clientRoles": {
        "realm-management": ["realm-admin"]
      }
    }
  ],
  "clients": [
    {
      "id": "client-uuid-account",
      "clientId": "account",
      "enabled": true,
      "publicClient": false,
      "serviceAccountsEnabled": false,
      "standardFlowEnabled": true,
      "protocol": "openid-connect"
    },
    {
      "id": "client-uuid-admin-cli",
      "clientId": "admin-cli",
      "enabled": true,
      "publicClient": true,
      "serviceAccountsEnabled": false,
      "protocol": "openid-connect"
    },
    {
      "id": "client-uuid-payment",
      "clientId": "svc-payment-bot",
      "name": "Payment Processing Service",
      "description": "OAuth client for the payment automation service",
      "enabled": true,
      "publicClient": false,
      "serviceAccountsEnabled": true,
      "standardFlowEnabled": false,
      "secret": "REDACTED-rotate-me",
      "protocol": "openid-connect",
      "attributes": {
        "client.secret.creation.time": "1673769600",
        "client.secret.expiration.time": "0"
      }
    },
    {
      "id": "client-uuid-datasync",
      "clientId": "svc-data-sync",
      "name": "Nightly Data Sync",
      "description": "OAuth client for the nightly data sync job",
      "enabled": true,
      "publicClient": false,
      "serviceAccountsEnabled": true,
      "standardFlowEnabled": false,
      "secret": "REDACTED-rotate-me",
      "protocol": "openid-connect",
      "attributes": {
        "client.secret.creation.time": "1746090000",
        "client.secret.expiration.time": "0"
      }
    },
    {
      "id": "client-uuid-legacy",
      "clientId": "legacy-integration",
      "name": "Legacy Integration",
      "description": "Old integration client with no MidPoint governance record",
      "enabled": true,
      "publicClient": false,
      "serviceAccountsEnabled": true,
      "standardFlowEnabled": false,
      "secret": "REDACTED-rotate-me",
      "protocol": "openid-connect",
      "attributes": {
        "client.secret.creation.time": "1704067200",
        "client.secret.expiration.time": "0"
      }
    }
  ]
}
`;
