package com.vrna.customer;

import android.os.Bundle;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.facebooklogin.FacebookLogin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        registerPlugin(FacebookLogin.class);
        registerPlugin(GoogleAuth.class);
        registerPlugin(CapacitorFirebaseAuth.class);

    }
}
